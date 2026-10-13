from django.contrib import admin
from .models import Category, Book


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('name',)


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'is_best_seller', 'is_new_arrival', 'created_at')
    list_filter = ('is_best_seller', 'is_new_arrival', 'created_at')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('price', 'is_best_seller', 'is_new_arrival')
    ordering = ('-created_at',)