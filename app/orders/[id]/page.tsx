import OrderStatusView from '@/components/orders/OrderStatusView';

export default async function OrderPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ token?: string }> }) {
  const { id } = await params;
  const { token } = await searchParams;
  return <OrderStatusView orderId={id} token={token || ''} />;
}
