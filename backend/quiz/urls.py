from django.urls import path
from .views import AllQuizzesList, QuizDelete, QuizListCreate, get_username

urlpatterns = [
    path("quizzes/", AllQuizzesList.as_view(), name="all_quizzes"),
    path("quizzes/user/", QuizListCreate.as_view(), name="user_quizzes"),
    path("quizzes/delete/<int:pk>/", QuizDelete.as_view(), name="delete_quiz"),
    path("get_username/", get_username, name="get_username"),
]
