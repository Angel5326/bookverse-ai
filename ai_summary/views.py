from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from store.models import Book
from .models import AISummary
from .services import generate_book_summary

def get_summary(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    
    # 1. Check if summary already exists in DB
    try:
        summary_obj = AISummary.objects.get(book=book)
        return JsonResponse({'summary': summary_obj.summary_text, 'source': 'database'})
    except AISummary.DoesNotExist:
        pass
    
    # 2. If not, generate using Gemini
    author_name = book.author.name if book.author else "Unknown Author"
    summary_text = generate_book_summary(book.title, author_name)
    
    # 3. Save to database for future
    if "Sorry" not in summary_text:
        AISummary.objects.create(book=book, summary_text=summary_text)
    
    return JsonResponse({'summary': summary_text, 'source': 'api'})