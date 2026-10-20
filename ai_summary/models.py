from django.db import models
from store.models import Book

class AISummary(models.Model):
    book = models.OneToOneField(Book, on_delete=models.CASCADE, related_name='ai_summary')
    summary_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Summary for {self.book.title}"