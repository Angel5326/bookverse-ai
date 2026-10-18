from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Subscriber

def subscribe(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        if email:
            Subscriber.objects.get_or_create(email=email)
            messages.success(request, "Subscribed successfully!")
    return redirect(request.META.get('HTTP_REFERER', 'store:home'))