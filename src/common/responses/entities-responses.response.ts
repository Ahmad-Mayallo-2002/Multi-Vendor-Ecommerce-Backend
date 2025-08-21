import { User } from '../../users/entities/user.entity';
import { BaseResponse } from './base-response.response';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { AccessToken } from '../objectTypes/accessToken.object';
import { Category } from '../../categories/entities/category.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';
import { Following } from '../../following/entities/following.entity';
import { FollowingsAndCount } from '../objectTypes/following.object';
import { Order } from '../../orders/entities/order.entity';
import { OrderResponse } from '../objectTypes/orderResponse.object';
import { ProductReview } from '../../product-review/entities/product-review.entity';
import { Product } from '../../products/entities/product.entity';
import { VendorReview } from '../../vendor-review/entities/vendor-review.entity';
import { NotificationMessagesResponse } from './notification.response';
import { Notification } from '../../notifications/entity/notification.entity';
import { DeviceToken } from '../../device-token/entity/device-token.entity';

// Auth Responses
export const UserSignUp = BaseResponse(User, false, 'UserSignUp');
export const VendorSignUp = BaseResponse(Vendor, false, 'VendorSignUp');
export const Login = BaseResponse(AccessToken, false, 'Login');
// Category Responses
export const CategoryListResponse = BaseResponse(
  Category,
  true,
  'CategoryList',
);
export const CategoryResponse = BaseResponse(Category, false, 'CategryItem');

// Cart Responses
export const CartListResponse = BaseResponse(Cart, true, 'CartList');
export const CartResponse = BaseResponse(Cart, false, 'CartResponse');
export const CartItemResponse = BaseResponse(
  CartItem,
  false,
  'CartItemResponse',
);

// Following Responses
export const FollowingResponse = BaseResponse(
  Following,
  false,
  'FollowingResponse',
);
export const FollowingsAndCountResponse = BaseResponse(
  FollowingsAndCount,
  false,
  'FollowingsAndCountResponse',
);

// Order Responses
export const OrderListResponse = BaseResponse(Order, true, 'OrderList');
export const OrderItemResponse = BaseResponse(Order, true, 'OrderItemResponse');
export const CreateOrderResponse = BaseResponse(
  OrderResponse,
  false,
  'CreateOrderResponse',
);

// Product and Product Reviews Responses
export const ProductReviewResponse = BaseResponse(
  ProductReview,
  false,
  'ProductReviewResponse',
);
export const ProductsResponse = BaseResponse(
  Product,
  true,
  'ProductsList',
  false,
);
export const ProductResponse = BaseResponse(Product, false, 'ProductItem');

// User Response
export const UsersResponse = BaseResponse(User, true, 'UserList');
export const UserResponse = BaseResponse(User, false, 'UserItem');

// Vendor And Vendor Reviews Responses
export const VendorReviewResponse = BaseResponse(
  VendorReview,
  false,
  'VendorReviewResponse',
);
export const VendorList = BaseResponse(Vendor, true, 'VendorList');
export const VendorItem = BaseResponse(Vendor, false, 'VendorItem');

// Primitive Data Responses
export const BooleanResponse = BaseResponse(Boolean, false, 'BooleanResponse');
export const StringResponse = BaseResponse(String, false, 'StringResponse');
export const NumberResponse = BaseResponse(Number, false, 'NumberResponse');
export const NotificationResponses = BaseResponse(
  NotificationMessagesResponse,
  false,
  'NotificationResponses',
);
export const NotificationsResponse = BaseResponse(
  Notification,
  true,
  'NotificationList',
  true,
);
export const NotificationResponse = BaseResponse(
  Notification,
  false,
  'NotificationItem',
);
export const DevicesTokensResponse = BaseResponse(
  DeviceToken,
  true,
  'DevicesTokens',
);
export const DeviceTokenResponse = BaseResponse(
  DeviceToken,
  false,
  'DeviceTokenItem',
);
