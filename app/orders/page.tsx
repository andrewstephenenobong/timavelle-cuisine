import CustomerOrderHistory from '@/components/orders/CustomerOrderHistory';

export const metadata = {
  title: 'My Orders | Timavelle Cuisine',
  description: 'Securely view your Timavelle Cuisine order history and order status.',
};

export default function OrdersPage() {
  return <CustomerOrderHistory />;
}
