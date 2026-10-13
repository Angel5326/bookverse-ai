from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('', include('accounts.urls')),
    path('', include('store.urls')),
    path('cart/', include('cart.urls')),
    path('orders/', include('orders.urls')),
    path('newsletter/', include('newsletter.urls')),
    path('ai/', include('ai_summary.urls')),
    path('api/', include('api.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

    import debug_toolbar
    urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]

# Admin site customization
admin.site.site_header = "BookVerse AI Administration"
admin.site.site_title = "BookVerse AI Admin"
admin.site.index_title = "Welcome to BookVerse AI Dashboard"