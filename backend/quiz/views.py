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
        
def show_json():
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

class QuizQuestion(APIView):

    def get(self, quiz_id):
        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response({"error": "Kuis tidak ditemukan!"}, status=status.HTTP_404_NOT_FOUND)
        
        questions = Question.objects.filter(quiz=quiz)
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)

    def post(self, request, **kwargs):
        try:
            quiz = Quiz.objects.get(id=kwargs["quiz_id"])  
        except Quiz.DoesNotExist:
            return Response({"error": "Kuis tidak ditemukan!"}, status=status.HTTP_404_NOT_FOUND)
        
        if not quiz.is_editable:
            return Response({"error": "Tidak dapat menambah pertanyaan!"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = QuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  
            return Response(
                {"message": "Pertanyaan berhasil dibuat!", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class QuizQuestionDetail(APIView):

    def get_object(self, pk):
        try:
            return Question.objects.get(id=pk)
        except Question.DoesNotExist:
            raise Http404

    def get(self, pk):
        question = self.get_object(pk)
        serializer = QuestionSerializer(question)
        return Response(serializer.data)
    
    def patch(self, request, pk):
        question = self.get_object(pk)
        
        if not question.quiz.is_editable:
            return Response({"error": "Tidak dapat mengedit pertanyaan!"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = QuestionSerializer(question, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, pk):
        question = self.get_object(pk)

        if not question.quiz.is_editable:
            return Response({"error": "Tidak dapat menghapus pertanyaan!"}, status=status.HTTP_400_BAD_REQUEST)

        question.delete()
        return Response(
            {"message": "Pertanyaan berhasil terhapus!"},
            status=status.HTTP_204_NO_CONTENT
        )
