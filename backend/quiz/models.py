from django.db import models
from django.contrib.auth.models import User

class Quiz(models.Model):
    # Kategori yang tersedia
    CATEGORY_CHOICES = [
        ('PU', 'Pengetahuan Umum'),
        ('ED', 'Edukasi'),
        ('HI', 'Hiburan'),
        ('BA', 'Bahasa'),
        ('KE', 'Kesehatan'),
        ('OL', 'Olahraga'),
        ('BU', 'Budaya'),
        ('TE', 'Teknologi'),
    ]

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quizzes', default=1)
    title = models.CharField("Quiz Title", max_length=255, default="New Quiz")
    description = models.TextField()
    category = models.CharField(max_length=2, choices=CATEGORY_CHOICES, default='PU') 
    created_at = models.DateTimeField(auto_now_add=True)
    is_editable = models.BooleanField(default=True)

    @property
    def author_name(self):
        return self.author.username

    @property
    def question_count(self):
        return str(self.questions.count())
    
    class Meta:
        verbose_name = "Quiz"
        verbose_name_plural = "Quizzes"
        ordering = ['id']

    def __str__(self):
        return self.title
    
class Question(models.Model):
    QUESTION_TYPES = [
        ('TF', 'True/False'),
        ('MC', 'Multiple Choice'),
        ('SA', 'Short Answer'),
    ]

    quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE)
    title = models.CharField(max_length=255, default="")
    question_type = models.CharField(max_length=2, choices=QUESTION_TYPES, default='MC')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Question"
        verbose_name_plural = "Questions"
        ordering = ["id"]

    def __str__(self):
        return self.title

class Answer(models.Model):
    question = models.ForeignKey(Question, related_name="answers", on_delete=models.CASCADE)
    answer_text = models.CharField(max_length=255, null=True, blank=True)
    is_right = models.BooleanField(default=False, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        verbose_name = "Answer"
        verbose_name_plural = "Answers"
        ordering = ["id"]

    def __str__(self):
        return self.answer_text

class Submission(models.Model):
    quiz = models.ForeignKey(Quiz, related_name='submissions', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Submission"
        verbose_name_plural = "Submissions"
        ordering = ['id']

    def __str__(self):
        return f"{self.user.username} - {self.quiz.title}"

class SubmissionAnswer(models.Model):
    submission = models.ForeignKey(Submission, related_name='answers', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer_text = models.CharField(max_length=255, null=True, blank=True)
    is_correct = models.BooleanField(default=False, null=True, blank=True)

    class Meta:
        verbose_name = "Submission Answer"
        verbose_name_plural = "Submission Answers"
        ordering = ['id']

    def __str__(self):
        return f"{self.submission.user.username} - {self.question.title}"