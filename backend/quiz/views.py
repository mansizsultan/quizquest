from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import Http404, JsonResponse
from .models import Quiz, Question, Submission, Answer, Submission, SubmissionAnswer
from .serializers import UserSerializer, QuizSerializer, QuestionSerializer, SubmissionSerializer

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
        return quiz
    
    def perform_update(self, serializer):
        serializer.save(author=self.request.user)

class QuizQuestion(APIView):

    def get(self, request, quiz_id, format=None):
        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response({"error": "Kuis tidak ditemukan!"}, status=status.HTTP_404_NOT_FOUND)
        
        questions = Question.objects.filter(quiz=quiz)
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)

    def post(self, request, quiz_id, format=None, **kwargs):
        try:
            quiz = Quiz.objects.get(id=quiz_id)  
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

    def get(self, request, pk, format=None):
        question = self.get_object(pk)
        serializer = QuestionSerializer(question)
        return Response(serializer.data)
    
    def patch(self, request, pk, format=None):
        question = self.get_object(pk)
        
        if not question.quiz.is_editable:
            return Response({"error": "Tidak dapat mengedit pertanyaan!"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = QuestionSerializer(question, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk, format=None):
        question = self.get_object(pk)

        if not question.quiz.is_editable:
            return Response({"error": "Tidak dapat menghapus pertanyaan!"}, status=status.HTTP_400_BAD_REQUEST)

        question.delete()
        return Response(
            {"message": "Pertanyaan berhasil terhapus!"},
            status=status.HTTP_204_NO_CONTENT
        )
    
class SubmissionView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        user = request.user
        submissions = Submission.objects.filter(user=user)
        
        result = []
        for submission in submissions:
            correct_answers = SubmissionAnswer.objects.filter(
                submission=submission, 
                is_correct=True
            ).count()
            
            total_questions = SubmissionAnswer.objects.filter(
                submission=submission
            ).count()
            
            score = (correct_answers / total_questions * 100) if total_questions > 0 else 0
            
            result.append({
                'id': submission.id,
                'quiz': submission.quiz.id,
                'quiz_title': submission.quiz.title,
                'submitted_at': submission.submitted_at,
                'correct_answers': correct_answers,
                'total_questions': total_questions,
                'score': score
            })
        
        return Response(result)
    
    def post(self, request, format=None):
        try:
            user = request.user
            quiz_id = request.data.get('quiz')
            answer_data = request.data.get('answers', [])
            
            if not quiz_id:
                return Response({"error": "Membutuhkan id kuis!"}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                quiz = Quiz.objects.get(id=quiz_id)
            except Quiz.DoesNotExist:
                return Response({"error": "Kuis tidak ditemukan!"}, status=status.HTTP_404_NOT_FOUND)
            
            old_submissions = Submission.objects.filter(quiz=quiz, user=user)
            if old_submissions.exists():
                old_submissions.delete()
            
            submission = Submission.objects.create(
                quiz=quiz,
                user=user
            )
            
            correct_answers = 0
            total_questions = 0
            submission_answers = []
            
            for answer in answer_data:
                question_id = answer.get('question')
                answer_text = answer.get('answer_text')
                
                try:
                    question = Question.objects.get(id=question_id, quiz=quiz)
                except Question.DoesNotExist:
                    continue
                
                is_correct = False
                total_questions += 1
                
                if question.question_type == 'MC' or question.question_type == 'TF':
                    correct_answer = Answer.objects.filter(question=question, is_right=True).first()
                    if correct_answer and correct_answer.answer_text == answer_text:
                        is_correct = True
                        correct_answers += 1
                
                elif question.question_type == 'SA':
                    correct_answer = Answer.objects.filter(question=question).first()
                    if correct_answer and correct_answer.answer_text.lower() == answer_text.lower():
                        is_correct = True
                        correct_answers += 1
                
                submission_answer = SubmissionAnswer.objects.create(
                    submission=submission,
                    question=question,
                    answer_text=answer_text,
                    is_correct=is_correct
                )
                
                submission_answers.append({
                    'id': submission_answer.id,
                    'question': question_id,
                    'answer_text': answer_text,
                    'is_correct': is_correct
                })
            
            return Response({
                'id': submission.id,
                'quiz': quiz.id,
                'quiz_title': quiz.title,
                'user': user.username,
                'submitted_at': submission.submitted_at,
                'total_questions': total_questions,
                'correct_answers': correct_answers,
                'score': (correct_answers / total_questions * 100) if total_questions > 0 else 0,
                'answers': submission_answers
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(str(e))
            return Response({"error": "Gagal memasukkan submisi"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SubmissionDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk, format=None):
        try:
            user = request.user
            
            try:
                submission = Submission.objects.get(id=pk, user=user)
            except Submission.DoesNotExist:
                return Response({"error": "Subimisi tidak ditemukan"}, status=status.HTTP_404_NOT_FOUND)
            
            quiz = submission.quiz
            
            submission_answers = SubmissionAnswer.objects.filter(submission=submission)
            
            total_questions = submission_answers.count()
            correct_answers = submission_answers.filter(is_correct=True).count()
            
            answers_data = []
            for answer in submission_answers:
                question = answer.question
                correct_answer = Answer.objects.filter(question=question, is_right=True).first()
                
                answers_data.append({
                    'id': answer.id,
                    'question_id': question.id,
                    'question_title': question.title,
                    'question_type': question.question_type,
                    'user_answer': answer.answer_text,
                    'is_correct': answer.is_correct,
                    'correct_answer': correct_answer.answer_text if correct_answer else None
                })
            
            return Response({
                'id': submission.id,
                'quiz': {
                    'id': quiz.id,
                    'title': quiz.title,
                    'description': quiz.description,
                    'category': quiz.category,
                },
                'user': user.username,
                'submitted_at': submission.submitted_at,
                'total_questions': total_questions,
                'correct_answers': correct_answers,
                'score': (correct_answers / total_questions * 100) if total_questions > 0 else 0,
                'answers': answers_data
            })
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
