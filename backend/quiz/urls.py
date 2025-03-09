from django.urls import path
from .views import (
    AllQuizzesList, QuizDetailView, UserQuizListView, QuizDelete, 
    QuizListCreate, get_username, show_json
)

urlpatterns = [
    path("quizzes/", AllQuizzesList.as_view(), name="all_quizzes"),
    path("quizzes/user/", UserQuizListView.as_view(), name="user-quizzes"),
    path("quiz/<int:pk>/", QuizDetailView.as_view(), name="quiz-detail"),
    path("create/quizzes/user/", QuizListCreate.as_view(), name="user_quizzes"),
    path("quizzes/delete/<int:pk>/", QuizDelete.as_view(), name="delete_quiz"),
    path("get_username/", get_username, name="get_username"),
    path('json/', show_json, name='show_json'),
]