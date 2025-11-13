import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, Users, TrendingUp, Plus, Edit2, Trash2, X, BarChart3, DollarSign } from 'lucide-react';

const API_URL = 'http://localhost:8000';

export default function FitnessStore() {
  const [activeView, setActiveView] = useState('productos');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchClientes();
    fetchPedidos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await fetch(`${API_URL}/productos`);
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await fetch(`${API_URL}/categorias`);
      const data = await res.json();
      setCategorias(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const res = await fetch(`${API_URL}/clientes`);
      const data = await res.json();
      setClientes(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const fetchPedidos = async () => {
    try {
      const res = await fetch(`${API_URL}/pedidos`);
      const data = await res.json();
      setPedidos(data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    }
  };

  // CRUD Productos
  const handleSaveProducto = async (formData) => {
    try {
      const url = editingItem 
        ? `${API_URL}/productos/${editingItem.id}`
        : `${API_URL}/productos`;
      
      const method = editingItem ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        fetchProductos();
        setShowModal(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  const handleDeleteProducto = async (id) => {
    if (window.confirm('¿Eliminar este producto?')) {
      try {
        await fetch(`${API_URL}/productos/${id}`, { method: 'DELETE' });
        fetchProductos();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    }
  };

  // CRUD Clientes
  const handleSaveCliente = async (formData) => {
    try {
      const url = editingItem 
        ? `${API_URL}/clientes/${editingItem.id}`
        : `${API_URL}/clientes`;
      
      const method = editingItem ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        fetchClientes();
        setShowModal(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error al guardar cliente:', error);
    }
  };

  const handleDeleteCliente = async (id) => {
    if (window.confirm('¿Eliminar este cliente?')) {
      try {
        await fetch(`${API_URL}/clientes/${id}`, { method: 'DELETE' });
        fetchClientes();
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
      }
    }
  };

  // Gestión de carrito
  const agregarAlCarrito = (producto) => {
    const existente = carrito.find(item => item.id === producto.id);
    if (existente) {
      setCarrito(carrito.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const actualizarCantidad = (id, cantidad) => {
    if (cantidad <= 0) {
      setCarrito(carrito.filter(item => item.id !== id));
    } else {
      setCarrito(carrito.map(item =>
        item.id === id ? { ...item, cantidad } : item
      ));
    }
  };

  const calcularTotal = () => {
    return carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  };

  const handleCrearPedido = async (clienteId) => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    try {
      const productos = carrito.map(item => ({
        producto_id: item.id,
        cantidad: item.cantidad
      }));

      const res = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: clienteId,
          productos
        })
      });

      if (res.ok) {
        alert('Pedido creado exitosamente');
        setCarrito([]);
        fetchPedidos();
        fetchProductos();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error al crear pedido:', error);
    }
  };

  const handleDeletePedido = async (id) => {
    if (window.confirm('¿Eliminar este pedido?')) {
      try {
        await fetch(`${API_URL}/pedidos/${id}`, { method: 'DELETE' });
        fetchPedidos();
        fetchProductos();
      } catch (error) {
        console.error('Error al eliminar pedido:', error);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(to right, #dc2626, #ea580c)',
        color: 'white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div className="container" style={{ padding: '1.5rem 1rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
            <TrendingUp size={36} />
            Fitness Supplements Store
          </h1>
          <p style={{ color: '#fecaca', marginTop: '0.5rem' }}>Tu tienda de suplementos deportivos</p>
        </div>
      </header>

      {/* Nav */}
      <nav style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div className="container" style={{ padding: 0 }}>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button
              onClick={() => setActiveView('dashboard')}
              style={{
                padding: '1rem 1.5rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: activeView === 'dashboard' ? '#dc2626' : 'white',
                color: activeView === 'dashboard' ? 'white' : '#374151',
                transition: 'all 0.2s'
              }}
            >
              <BarChart3 size={20} />
              Dashboard
            </button>
            <button
              onClick={() => setActiveView('productos')}
              style={{
                padding: '1rem 1.5rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: activeView === 'productos' ? '#dc2626' : 'white',
                color: activeView === 'productos' ? 'white' : '#374151',
                transition: 'all 0.2s'
              }}
            >
              <Package size={20} />
              Productos
            </button>
            <button
              onClick={() => setActiveView('clientes')}
              style={{
                padding: '1rem 1.5rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: activeView === 'clientes' ? '#dc2626' : 'white',
                color: activeView === 'clientes' ? 'white' : '#374151',
                transition: 'all 0.2s'
              }}
            >
              <Users size={20} />
              Clientes
            </button>
            <button
              onClick={() => setActiveView('pedidos')}
              style={{
                padding: '1rem 1.5rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: activeView === 'pedidos' ? '#dc2626' : 'white',
                color: activeView === 'pedidos' ? 'white' : '#374151',
                transition: 'all 0.2s'
              }}
            >
              <ShoppingCart size={20} />
              Pedidos
              {carrito.length > 0 && (
                <span style={{
                  backgroundColor: '#f97316',
                  color: 'white',
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px'
                }}>
                  {carrito.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="container" style={{ padding: '2rem 1rem' }}>
  {activeView === 'dashboard' && (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
        Dashboard de Ventas
      </h2>
      
      {/* Tarjetas de Estadísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Total Ventas */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Ventas</p>
              <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#10b981' }}>
                ${pedidos.reduce((sum, p) => sum + p.total, 0).toFixed(2)}
              </p>
            </div>
            <DollarSign size={40} style={{ color: '#10b981' }} />
          </div>
        </div>

        {/* Total Pedidos */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Pedidos</p>
              <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#3b82f6' }}>
                {pedidos.length}
              </p>
            </div>
            <ShoppingCart size={40} style={{ color: '#3b82f6' }} />
          </div>
        </div>

        {/* Total Productos */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Productos</p>
              <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                {productos.length}
              </p>
            </div>
            <Package size={40} style={{ color: '#8b5cf6' }} />
          </div>
        </div>

        {/* Total Clientes */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Clientes</p>
              <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#f97316' }}>
                {clientes.length}
              </p>
            </div>
            <Users size={40} style={{ color: '#f97316' }} />
          </div>
        </div>
      </div>

      {/* Secciones Informativas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {/* Top 5 Productos */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
        }}>
          <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '1rem', color: '#1f2937' }}>
            Top 5 Productos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {productos.slice(0, 5).map((producto, index) => (
              <div key={producto.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ 
                    backgroundColor: '#fee2e2', 
                    color: '#dc2626', 
                    width: '1.5rem', 
                    height: '1.5rem', 
                    borderRadius: '9999px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </span>
                  <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{producto.nombre}</span>
                </div>
                <span style={{ color: '#dc2626', fontWeight: 'bold' }}>${producto.precio.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas de Stock */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
        }}>
          <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '1rem', color: '#1f2937' }}>
            ⚠️ Alertas de Stock Bajo
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {productos.filter(p => p.stock < 20).slice(0, 5).length > 0 ? (
              productos.filter(p => p.stock < 20).slice(0, 5).map(producto => (
                <div key={producto.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderBottom: '1px solid #e5e7eb',
                  paddingBottom: '0.5rem'
                }}>
                  <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{producto.nombre}</span>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    backgroundColor: producto.stock < 10 ? '#fee2e2' : '#fef3c7',
                    color: producto.stock < 10 ? '#dc2626' : '#f59e0b'
                  }}>
                    Stock: {producto.stock}
                  </span>
                </div>
              ))
            ) : (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>
                ✅ Todos los productos tienen stock suficiente
              </p>
            )}
          </div>
        </div>

        {/* Pedidos Recientes */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
        }}>
          <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '1rem', color: '#1f2937' }}>
            📦 Últimos Pedidos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pedidos.slice(0, 5).map(pedido => (
              <div key={pedido.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: '0.5rem'
              }}>
                <div>
                  <p style={{ fontWeight: '500', fontSize: '0.875rem' }}>Pedido #{pedido.id}</p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{pedido.cliente_nombre}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 'bold', color: '#dc2626' }}>${pedido.total.toFixed(2)}</p>
                  <span style={{ 
                    fontSize: '0.75rem',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '0.25rem',
                    backgroundColor: pedido.estado === 'Completado' ? '#d1fae5' : '#fef3c7',
                    color: pedido.estado === 'Completado' ? '#065f46' : '#92400e'
                  }}>
                    {pedido.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )}

  {activeView === 'productos' && (
          <ProductosView
            productos={productos}
            categorias={categorias}
            onAdd={() => {
              setEditingItem(null);
              setModalType('producto');
              setShowModal(true);
            }}
            onEdit={(producto) => {
              setEditingItem(producto);
              setModalType('producto');
              setShowModal(true);
            }}
            onDelete={handleDeleteProducto}
            onAddToCart={agregarAlCarrito}
          />
        )}

        {activeView === 'clientes' && (
          <ClientesView
            clientes={clientes}
            onAdd={() => {
              setEditingItem(null);
              setModalType('cliente');
              setShowModal(true);
            }}
            onEdit={(cliente) => {
              setEditingItem(cliente);
              setModalType('cliente');
              setShowModal(true);
            }}
            onDelete={handleDeleteCliente}
          />
        )}

        {activeView === 'pedidos' && (
          <PedidosView
            pedidos={pedidos}
            carrito={carrito}
            clientes={clientes}
            onActualizarCantidad={actualizarCantidad}
            onCrearPedido={() => {
              setModalType('confirmar-pedido');
              setShowModal(true);
            }}
            onDeletePedido={handleDeletePedido}
            calcularTotal={calcularTotal}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1f2937', color: 'white', marginTop: '3rem' }}>
        <div className="container" style={{ padding: '2rem 1rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            <div>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.75rem' }}>Fitness Supplements</h3>
              <p style={{ color: '#9ca3af' }}>Los mejores suplementos para alcanzar tus metas fitness</p>
            </div>
            <div>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.75rem' }}>Contacto</h3>
              <p style={{ color: '#9ca3af' }}>Email: info@fitnesssupplements.com</p>
              <p style={{ color: '#9ca3af' }}>Tel: 381-555-0000</p>
            </div>
            <div>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.75rem' }}>Horarios</h3>
              <p style={{ color: '#9ca3af' }}>Lunes a Viernes: 9:00 - 20:00</p>
              <p style={{ color: '#9ca3af' }}>Sábados: 9:00 - 14:00</p>
            </div>
          </div>
          <div style={{
            borderTop: '1px solid #374151',
            marginTop: '2rem',
            paddingTop: '1.5rem',
            textAlign: 'center',
            color: '#9ca3af'
          }}>
            <p>&copy; 2025 Fitness Supplements Store. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {showModal && (
        <Modal
          type={modalType}
          item={editingItem}
          categorias={categorias}
          clientes={clientes}
          onClose={() => {
            setShowModal(false);
            setEditingItem(null);
          }}
          onSaveProducto={handleSaveProducto}
          onSaveCliente={handleSaveCliente}
          onConfirmarPedido={handleCrearPedido}
        />
      )}
    </div>
  );
}

// Componente Vista de Productos
function ProductosView({ productos, categorias, onAdd, onEdit, onDelete, onAddToCart }) {
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [busqueda, setBusqueda] = useState('');

  const productosFiltrados = productos
    .filter(p => filtroCategoria === 'todas' || p.categoria_id === parseInt(filtroCategoria))
    .filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div>
      <div style={{ display: 'f lex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Catálogo de Productos</h2>
        <button
          onClick={onAdd}
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '0.5rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600'
          }}
        >
          <Plus size={20} />
          Nuevo Producto
        </button>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
          🔍 Buscar producto:
        </label>
        <input
          type="text"
          placeholder="Escribe el nombre del producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '1rem'
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
          Filtrar por categoría:
        </label>
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '1rem'
          }}
        >
          <option value="todas">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {productosFiltrados.map(producto => (
          <div key={producto.id} style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <img
              src={producto.imagen_url || 'https://via.placeholder.com/300x200?text=Sin+Imagen'}
              alt={producto.nombre}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <div style={{ padding: '1rem' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#dc2626',
                backgroundColor: '#fee2e2',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem'
              }}>
                {producto.categoria_nombre}
              </span>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginTop: '0.5rem', color: '#1f2937' }}>
                {producto.nombre}
              </h3>
              <p className="line-clamp-2" style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {producto.descripcion}
              </p>
              <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>
                  ${producto.precio.toFixed(2)}
                </span>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Stock: {producto.stock}
                </span>
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => onAddToCart(producto)}
                  disabled={producto.stock === 0}
                  style={{
                    flex: 1,
                    backgroundColor: producto.stock === 0 ? '#d1d5db' : '#f97316',
                    color: 'white',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: producto.stock === 0 ? 'not-allowed' : 'pointer',
                    fontWeight: '600'
                  }}
                >
                  {producto.stock === 0 ? 'Sin Stock' : 'Agregar'}
                </button>
                <button
                  onClick={() => onEdit(producto)}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => onDelete(producto.id)}
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente Vista de Clientes
function ClientesView({ clientes, onAdd, onEdit, onDelete }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Gestión de Clientes</h2>
        <button
          onClick={onAdd}
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '0.5rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600'
          }}
        >
          <Plus size={20} />
          Nuevo Cliente
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f3f4f6' }}>
            <tr>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>ID</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Nombre</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Email</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Teléfono</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Dirección</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: 'white' }}>
            {clientes.map(cliente => (
              <tr key={cliente.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#111827' }}>{cliente.id}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{cliente.nombre}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>{cliente.email}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>{cliente.telefono}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>{cliente.direccion}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => onEdit(cliente)}
                      style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: '0.5rem',
                        borderRadius: '0.25rem',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(cliente.id)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '0.5rem',
                        borderRadius: '0.25rem',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Componente Vista de Pedidos
function PedidosView({ pedidos, carrito, clientes, onActualizarCantidad, onCrearPedido, onDeletePedido, calcularTotal }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
      <div style={{ gridColumn: '1/-1' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Historial de Pedidos */}
          <div style={{ gridColumn: pedidos.length > 0 ? 'span 2' : 'span 3' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
              Historial de Pedidos
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pedidos.map(pedido => (
                <div key={pedido.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  padding: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>Pedido #{pedido.id}</h3>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Cliente: {pedido.cliente_nombre}</p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Email: {pedido.cliente_email}</p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Fecha: {new Date(pedido.fecha).toLocaleString()}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        backgroundColor: pedido.estado === 'Completado' ? '#d1fae5' :
                                       pedido.estado === 'En Proceso' ? '#fef3c7' : '#f3f4f6',
                        color: pedido.estado === 'Completado' ? '#065f46' :
                              pedido.estado === 'En Proceso' ? '#92400e' : '#1f2937'
                      }}>
                        {pedido.estado}
                      </span>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626', marginTop: '0.5rem' }}>
                        ${pedido.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeletePedido(pedido.id)}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.25rem',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Trash2 size={16} />
                    Eliminar Pedido
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Carrito */}
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem',
              position: 'sticky',
              top: '6rem'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <ShoppingCart size={24} />
                Carrito de Compras
              </h2>
              
              {carrito.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>
                  El carrito está vacío
                </p>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {carrito.map(item => (
                      <div key={item.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #e5e7eb',
                        paddingBottom: '0.75rem'
                      }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: '600', fontSize: '0.875rem' }}>{item.nombre}</p>
                          <p style={{ color: '#dc2626', fontWeight: 'bold' }}>${item.precio.toFixed(2)}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            onClick={() => onActualizarCantidad(item.id, item.cantidad - 1)}
                            style={{
                              backgroundColor: '#e5e7eb',
                              width: '2rem',
                              height: '2rem',
                              borderRadius: '0.25rem',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold'
                            }}
                          >
                            -
                          </button>
                          <span style={{ width: '2rem', textAlign: 'center', fontWeight: '600' }}>
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() => onActualizarCantidad(item.id, item.cantidad + 1)}
                            style={{
                              backgroundColor: '#e5e7eb',
                              width: '2rem',
                              height: '2rem',
                              borderRadius: '0.25rem',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold'
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{
                    borderTop: '1px solid #e5e7eb',
                    paddingTop: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '1.125rem',
                      fontWeight: 'bold'
                    }}>
                      <span>Total:</span>
                      <span style={{ color: '#dc2626' }}>${calcularTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={onCrearPedido}
                    style={{
                      width: '100%',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '1rem'
                    }}
                  >
                    Finalizar Compra
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente Modal
function Modal({ type, item, categorias, clientes, onClose, onSaveProducto, onSaveCliente, onConfirmarPedido }) {
  const [formData, setFormData] = useState(item || {});
  const [selectedCliente, setSelectedCliente] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'producto') {
      onSaveProducto(formData);
    } else if (type === 'cliente') {
      onSaveCliente(formData);
    } else if (type === 'confirmar-pedido' && selectedCliente) {
      onConfirmarPedido(parseInt(selectedCliente));
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 20px 25px rgba(0,0,0,0.15)',
        maxWidth: '28rem',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
            {type === 'producto' && (item ? 'Editar Producto' : 'Nuevo Producto')}
            {type === 'cliente' && (item ? 'Editar Cliente' : 'Nuevo Cliente')}
            {type === 'confirmar-pedido' && 'Confirmar Pedido'}
          </h3>
          <button
            onClick={onClose}
            style={{
              color: '#6b7280',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {type === 'producto' && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre || ''}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Descripción
                </label>
                <textarea
                  required
                  value={formData.descripcion || ''}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Precio
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.precio || ''}
                  onChange={(e) => setFormData({...formData, precio: parseFloat(e.target.value)})}
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Stock
                </label>
                <input
                  type="number"
                  required
                  value={formData.stock || ''}
                  onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Categoría
                </label>
                <select
                  required
                  value={formData.categoria_id || ''}
                  onChange={(e) => setFormData({...formData, categoria_id: parseInt(e.target.value)})}
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Seleccionar...</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  URL de Imagen
                </label>
                <input
                  type="url"
                  value={formData.imagen_url || ''}
                  onChange={(e) => setFormData({...formData, imagen_url: e.target.value})}
                  placeholder="https://..."
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </>
          )}

          {type === 'cliente' && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre || ''}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telefono || ''}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Dirección
                </label>
                <textarea
                  required
                  value={formData.direccion || ''}
                  onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                  rows="2"
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>
            </>
          )}

          {type === 'confirmar-pedido' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Seleccionar Cliente
              </label>
              <select
                required
                value={selectedCliente}
                onChange={(e) => setSelectedCliente(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              >
                <option value="">Seleccionar cliente...</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} - {cliente.email}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                backgroundColor: '#d1d5db',
                color: '#1f2937',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {type === 'confirmar-pedido' ? 'Confirmar Pedido' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>  
  );
}