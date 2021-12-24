from    django.urls import path
from django.urls.resolvers import URLPattern
from base.view import order_views as views
urlpatterns = [
    path('add/', views.addOrderItems, name='orders-add'),
    path('myorders/', views.getMyOrders, name='myorders'),
    path('<str:pk>/', views.getOrderbyId, name='user-order'),
    path('<str:pk>/pay/', views.updateOrderToPaid, name='pay'),
]