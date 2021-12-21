from    django.urls import path
from django.urls.resolvers import URLPattern
from base.view import product_views as views
urlpatterns = [
    path('',views.GetProducts, name='products'),
    path('<str:pk>/',views.GetProduct, name='product'),
]