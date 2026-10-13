from django.conf import settings


def global_context(request):
    from store.models import Category, Book
    try:
        categories = Category.objects.all()[:10]
        best_sellers = Book.objects.filter(is_best_seller=True)[:5]
        new_arrivals = Book.objects.filter(is_new_arrival=True)[:5]
    except Exception:
        categories = []
        best_sellers = []
        new_arrivals = []

    cart_count = 0
    if request.user.is_authenticated:
        try:
            from cart.models import Cart
            cart = Cart.objects.filter(user=request.user, is_active=True).first()
            if cart:
                cart_count = cart.items.count()
        except Exception:
            pass

    return {
        'global_categories': categories,
        'global_best_sellers': best_sellers,
        'global_new_arrivals': new_arrivals,
        'cart_count': cart_count,
        'SITE_NAME': 'BookVerse AI',
        'DEBUG': settings.DEBUG,
    }