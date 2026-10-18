from django.contrib import admin
from .models import Author, Category, Book, Review, Wishlist


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'price', 'stock', 'is_best_seller', 'is_new_arrival')
    list_filter = ('is_best_seller', 'is_new_arrival', 'category', 'author')
    search_fields = ('title', 'isbn')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('price', 'stock', 'is_best_seller', 'is_new_arrival')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('book', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'created_at')