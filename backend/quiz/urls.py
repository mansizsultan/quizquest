from django.urls import path
from .views import (
    AllQuizzesList, QuizDetailView, UserQuizListView, QuizDelete, QuizUpdate,
    QuizListCreate, get_username, show_json, show_questions, 
    QuizQuestion, QuizQuestionDetail, SubmissionView, SubmissionDetailView
)

urlpatterns = [
    path("quizzes/", AllQuizzesList.as_view(), name="all_quizzes"),
    path("quizzes/user/", UserQuizListView.as_view(), name="user-quizzes"),
    path("quiz/<int:pk>/", QuizDetailView.as_view(), name="quiz-detail"),
    path("create/quizzes/user/", QuizListCreate.as_view(), name="user_quizzes"),
    path("quizzes/delete/<int:pk>/", QuizDelete.as_view(), name="delete_quiz"),
    path("quizzes/update/<int:pk>/", QuizUpdate.as_view(), name="update_quiz"),
    path("get_username/", get_username, name="get_username"),
    path('json/', show_json, name='show_json'),
    path('questions/', show_questions, name='show_questions'),
    path("create/quiz/<int:quiz_id>/questions/", QuizQuestion.as_view(), name="quiz-question-create"),
    path('quiz/<int:quiz_id>/questions/', QuizQuestion.as_view(), name='quiz-question-list'),
    path('questions/<int:pk>/', QuizQuestionDetail.as_view(), name='quiz-question-detail'),
    path('submissions/', SubmissionView.as_view(), name='submissions-list-create'),
    path('submissions/<int:pk>/', SubmissionDetailView.as_view(), name='submission-detail'),
]