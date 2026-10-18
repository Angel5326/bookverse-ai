from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from store.models import Book
from .models import Cart, CartItem


@login_required
def cart_detail(request):
    # User ku oru active cart irundha edukanum, illena create pannanum
    cart, created = Cart.objects.get_or_create(user=request.user, is_active=True)
    context = {
        'cart': cart
    }
    return render(request, 'cart/cart_detail.html', context)


@login_required
def add_to_cart(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    cart, created = Cart.objects.get_or_create(user=request.user, is_active=True)
    
    # Book already cart la irukka nu check pannuvom
    cart_item, item_created = CartItem.objects.get_or_create(cart=cart, book=book)
    
    if not item_created:
        cart_item.quantity += 1
        cart_item.save()
        messages.success(request, f"Increased quantity for {book.title}.")
    else:
        messages.success(request, f"Added {book.title} to cart.")
        
    return redirect('cart:cart_detail')


@login_required
def remove_from_cart(request, item_id):
    cart_item = get_object_or_404(CartItem, id=item_id)
    book_title = cart_item.book.title
    cart_item.delete()
    messages.success(request, f"Removed {book_title} from cart.")
    return redirect('cart:cart_detail')