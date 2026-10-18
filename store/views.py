from django.shortcuts import render, get_object_or_404
from .models import Book, Category


def home(request):
    books = Book.objects.all()[:8]  # Home page la first 8 books mattum
    categories = Category.objects.all()
    context = {
        'books': books,
        'categories': categories,
    }
    return render(request, 'store/home.html', context)


def book_list(request):
    # Ella books um kaatanum
    books = Book.objects.all()
    
    # Category wise filter panna (Optional ah frontend la use pannalaam)
    category_slug = request.GET.get('category')
    if category_slug:
        books = books.filter(category__slug=category_slug)
        
    categories = Category.objects.all()
    
    context = {
        'books': books,
        'categories': categories,
    }
    return render(request, 'store/book_list.html', context)


def book_detail(request, slug):
    # Oru specific book oda details kaatanum
    book = get_object_or_404(Book, slug=slug)
    
    # Reviews ah eduthu anuppuvom
    reviews = book.reviews.all().order_by('-created_at')
    
    context = {
        'book': book,
        'reviews': reviews,
    }
    return render(request, 'store/book_detail.html', context)