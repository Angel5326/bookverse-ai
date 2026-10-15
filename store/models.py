from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Book(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_best_seller = models.BooleanField(default=False)
    is_new_arrival = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    @property
    def discount_pct(self):
        """Calculates a realistic discount percentage between 15% and 40%."""
        discounts = [20, 28, 35, 15, 30, 25, 40, 22, 33, 18]
        return discounts[(self.id or 1) % len(discounts)]

    @property
    def original_price(self):
        """Calculates original MRP before discount."""
        pct = self.discount_pct
        orig = float(self.price) / (1 - pct / 100)
        return int(round(orig / 10) * 10 - 1) if round(orig / 10) * 10 - 1 > float(self.price) else int(round(orig))

    def __str__(self):
        return self.title