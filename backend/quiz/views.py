from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import Http404, JsonResponse
from .models import Quiz, Question, Submission, Answer
from .serializers import UserSerializer, QuizSerializer, QuestionSerializer

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_username(request):
    return Response({"username": request.user.username})

class AllQuizzesList(generics.ListAPIView):
    serializer_class = QuizSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Quiz.objects.all()
        
def show_json(request):
    data = Quiz.objects.all()
    serialized_data = QuizSerializer(data, many=True).data 
    return JsonResponse(serialized_data, safe=False)  

def show_questions():
    data = Question.objects.all()
    serialized_data = QuestionSerializer(data, many=True).data     
    return JsonResponse(serialized_data, safe=False)

class QuizDetailView(generics.RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.AllowAny]
    
class UserQuizListView(generics.ListAPIView):
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Quiz.objects.filter(author=self.request.user)

class QuizListCreate(generics.ListCreateAPIView):
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Quiz.objects.filter(author=user)

    def perform_create(self, serializer):
        quiz = serializer.save(author=self.request.user)
        questions_data = self.request.data.get("questions", [])
        return quiz

class QuizDelete(generics.DestroyAPIView):
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Quiz.objects.filter(author=user)
    
class QuizUpdate(generics.RetrieveUpdateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        quiz = Quiz.objects.filter(author=user)
        if quiz.filter(submissions__isnull=False).exists():
            quiz.update(is_editable=False) 
        return quiz