from django.contrib.auth.models import Permission
from django.core.checks import messages
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework .permissions import IsAuthenticated, IsAdminUser


from django.contrib.auth.models import User
from .models import Product
from .products import products
from .serializers import ProductSerializer, UserSerializer, UserSerializerWithToken

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from rest_framework import status




# Create your views here.






# @api_view(['GET'])
# def GetProduct(request,pk):
#     product = Product.objects.get(_id=pk)
#     serializer = ProductSerializer(product, many=False)
#     return Response(serializer.data)