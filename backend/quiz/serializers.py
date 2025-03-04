from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Quiz, Question, Answer, Submission, SubmissionAnswer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class QuizSerializer(serializers.ModelSerializer):
    question_count = serializers.SerializerMethodField()
    category_display = serializers.CharField(source='get_category_display', read_only=True)  # Nama baru

    class Meta:
        model = Quiz
        fields = ['id', 'author', 'title', 'description', 'category', 'category_display', 'created_at', 'question_count', 'is_editable']
        extra_kwargs = {"author": {"read_only": True}}

    def get_question_count(self, obj):
        return obj.question_count
    
class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'answer_text', 'is_right']

class QuestionSerializer(serializers.ModelSerializer):
    quiz = serializers.PrimaryKeyRelatedField(queryset=Quiz.objects.all())  # Hanya menampilkan ID quiz
    answers = AnswerSerializer(many=True)
    question_type = serializers.CharField(source='get_question_type_display')

    class Meta:
        model = Question
        fields = ['id', 'quiz', 'title', 'question_type', 'is_editable', 'answers']

    def validate(self, data):
        # Validasi tipe soal dan jawaban
        question_type = data.get('question_type')
        answers = data.get('answers', [])

        if question_type == 'TF' and len(answers) != 1:
            raise serializers.ValidationError("True/False questions must have exactly one answer.")
        return data

    def create(self, validated_data):
        answers_data = validated_data.pop("answers", [])
        question = Question.objects.create(**validated_data)

        for answer_data in answers_data:
            Answer.objects.create(question=question, **answer_data)

        return question

    def update(self, instance, validated_data):
        instance.title = validated_data.pop("title", instance.title)
        
        # Update the associated answers
        answers_data = validated_data.pop("answers", [])
        instance.answers.all().delete()
        for answer_data in answers_data:
            Answer.objects.create(question=instance, **answer_data)

        instance.save()
        return instance

class SubmissionSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)  # Menampilkan username user

    class Meta:
        model = Submission
        fields = ['id', 'quiz', 'user', 'submitted_at']

class SubmissionAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubmissionAnswer
        fields = ['id', 'submission', 'question', 'answer_text', 'is_correct']