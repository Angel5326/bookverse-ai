from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from cart.models import Cart
from .models import Order, OrderItem

@login_required
def checkout(request):
    cart = Cart.objects.filter(user=request.user, is_active=True).first()
    if not cart or not cart.items.exists():
        messages.warning(request, "Your cart is empty.")
        return redirect('store:book_list')

    if request.method == 'POST':
        full_name = request.POST.get('full_name')
        address = request.POST.get('address')
        phone = request.POST.get('phone')
        
        # Create Order
        order = Order.objects.create(
            user=request.user,
            full_name=full_name,
            address=address,
            phone=phone,
            total_amount=cart.total_price
        )
        
        # Move items to OrderItem
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                book=item.book,
                price=item.book.price,
                quantity=item.quantity
            )
        
        # Clear Cart
        cart.delete()
        messages.success(request, "Order placed successfully!")
        return redirect('orders:order_success')

    return render(request, 'orders/checkout.html', {'cart': cart})

@login_required
def order_success(request):
    return render(request, 'orders/order_success.html')