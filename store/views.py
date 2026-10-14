from django.shortcuts import render
from .models import Book, Category


def home(request):
    books = Book.objects.all()
    best_sellers = Book.objects.filter(is_best_seller=True)[:8]
    new_arrivals = Book.objects.filter(is_new_arrival=True)[:8]
    categories = Category.objects.all()
    context = {
        'books': books[:8],
        'best_sellers': best_sellers if best_sellers.exists() else books[:8],
        'new_arrivals': new_arrivals if new_arrivals.exists() else books[:8],
        'categories': categories,
    }
    return render(request, 'store/home.html', context)