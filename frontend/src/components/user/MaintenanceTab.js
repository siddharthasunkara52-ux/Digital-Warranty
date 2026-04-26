import { useState, useEffect } from 'react';
import MaintenancePanel from '../MaintenancePanel';
import { getProducts } from '../../services/productService';
import { useToast } from '../../hooks/useToast';
import Toast from '../Toast';

function MaintenanceTab() {
  const [products, setProducts] = useState([]);
  const { toast, showToast } = useToast();

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (error) {
      showToast('Unable to fetch products for maintenance.', 'error');
    }
  };

  useEffect(() => {
    fetchProducts();

  }, []);

  return (
    <div className="space-y-4">
      <MaintenancePanel products={products} refresh={fetchProducts} setToast={(t) => showToast(t.message, t.type)} />
      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}

export default MaintenanceTab;
