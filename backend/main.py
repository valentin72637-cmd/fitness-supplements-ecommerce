from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import sqlite3
from datetime import datetime

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar el dominio del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conexión a la base de datos
def get_db():
    conn = sqlite3.connect("fitness_store.db")
    conn.row_factory = sqlite3.Row
    return conn

# Modelos Pydantic
class ProductCreate(BaseModel):
    nombre: str
    descripcion: str
    precio: float
    stock: int
    categoria_id: int
    imagen_url: Optional[str] = None

class ProductUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio: Optional[float] = None
    stock: Optional[int] = None
    categoria_id: Optional[int] = None
    imagen_url: Optional[str] = None

class ClienteCreate(BaseModel):
    nombre: str
    email: str
    telefono: str
    direccion: str

class ClienteUpdate(BaseModel):
    nombre: Optional[str] = None
    email: Optional[str] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None

class PedidoCreate(BaseModel):
    cliente_id: int
    productos: List[dict]  # [{"producto_id": 1, "cantidad": 2}, ...]

# Endpoints de Productos
@app.get("/productos")
def get_productos():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT p.*, c.nombre as categoria_nombre 
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
    """)
    productos = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return productos

@app.get("/productos/{producto_id}")
def get_producto(producto_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT p.*, c.nombre as categoria_nombre 
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE p.id = ?
    """, (producto_id,))
    producto = cursor.fetchone()
    conn.close()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return dict(producto)

@app.post("/productos")
def create_producto(producto: ProductCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, imagen_url)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (producto.nombre, producto.descripcion, producto.precio, 
          producto.stock, producto.categoria_id, producto.imagen_url))
    conn.commit()
    producto_id = cursor.lastrowid
    conn.close()
    return {"id": producto_id, "message": "Producto creado exitosamente"}

@app.put("/productos/{producto_id}")
def update_producto(producto_id: int, producto: ProductUpdate):
    conn = get_db()
    cursor = conn.cursor()
    
    updates = []
    values = []
    
    if producto.nombre is not None:
        updates.append("nombre = ?")
        values.append(producto.nombre)
    if producto.descripcion is not None:
        updates.append("descripcion = ?")
        values.append(producto.descripcion)
    if producto.precio is not None:
        updates.append("precio = ?")
        values.append(producto.precio)
    if producto.stock is not None:
        updates.append("stock = ?")
        values.append(producto.stock)
    if producto.categoria_id is not None:
        updates.append("categoria_id = ?")
        values.append(producto.categoria_id)
    if producto.imagen_url is not None:
        updates.append("imagen_url = ?")
        values.append(producto.imagen_url)
    
    if not updates:
        raise HTTPException(status_code=400, detail="No hay campos para actualizar")
    
    values.append(producto_id)
    query = f"UPDATE productos SET {', '.join(updates)} WHERE id = ?"
    
    cursor.execute(query, values)
    conn.commit()
    conn.close()
    return {"message": "Producto actualizado exitosamente"}

@app.delete("/productos/{producto_id}")
def delete_producto(producto_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM productos WHERE id = ?", (producto_id,))
    conn.commit()
    conn.close()
    return {"message": "Producto eliminado exitosamente"}

# Endpoints de Categorías
@app.get("/categorias")
def get_categorias():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM categorias")
    categorias = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return categorias

# Endpoints de Clientes
@app.get("/clientes")
def get_clientes():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM clientes")
    clientes = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return clientes

@app.get("/clientes/{cliente_id}")
def get_cliente(cliente_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM clientes WHERE id = ?", (cliente_id,))
    cliente = cursor.fetchone()
    conn.close()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return dict(cliente)

@app.post("/clientes")
def create_cliente(cliente: ClienteCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO clientes (nombre, email, telefono, direccion)
        VALUES (?, ?, ?, ?)
    """, (cliente.nombre, cliente.email, cliente.telefono, cliente.direccion))
    conn.commit()
    cliente_id = cursor.lastrowid
    conn.close()
    return {"id": cliente_id, "message": "Cliente registrado exitosamente"}

@app.put("/clientes/{cliente_id}")
def update_cliente(cliente_id: int, cliente: ClienteUpdate):
    conn = get_db()
    cursor = conn.cursor()
    
    updates = []
    values = []
    
    if cliente.nombre is not None:
        updates.append("nombre = ?")
        values.append(cliente.nombre)
    if cliente.email is not None:
        updates.append("email = ?")
        values.append(cliente.email)
    if cliente.telefono is not None:
        updates.append("telefono = ?")
        values.append(cliente.telefono)
    if cliente.direccion is not None:
        updates.append("direccion = ?")
        values.append(cliente.direccion)
    
    if not updates:
        raise HTTPException(status_code=400, detail="No hay campos para actualizar")
    
    values.append(cliente_id)
    query = f"UPDATE clientes SET {', '.join(updates)} WHERE id = ?"
    
    cursor.execute(query, values)
    conn.commit()
    conn.close()
    return {"message": "Cliente actualizado exitosamente"}

@app.delete("/clientes/{cliente_id}")
def delete_cliente(cliente_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM clientes WHERE id = ?", (cliente_id,))
    conn.commit()
    conn.close()
    return {"message": "Cliente eliminado exitosamente"}

# Endpoints de Pedidos
@app.get("/pedidos")
def get_pedidos():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT p.*, c.nombre as cliente_nombre, c.email as cliente_email
        FROM pedidos p
        LEFT JOIN clientes c ON p.cliente_id = c.id
        ORDER BY p.fecha DESC
    """)
    pedidos = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return pedidos

@app.get("/pedidos/{pedido_id}")
def get_pedido(pedido_id: int):
    conn = get_db()
    cursor = conn.cursor()
    
    # Obtener información del pedido
    cursor.execute("""
        SELECT p.*, c.nombre as cliente_nombre, c.email as cliente_email
        FROM pedidos p
        LEFT JOIN clientes c ON p.cliente_id = c.id
        WHERE p.id = ?
    """, (pedido_id,))
    pedido = cursor.fetchone()
    
    if not pedido:
        conn.close()
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    
    # Obtener detalles del pedido
    cursor.execute("""
        SELECT dp.*, pr.nombre as producto_nombre, pr.precio
        FROM detalle_pedido dp
        LEFT JOIN productos pr ON dp.producto_id = pr.id
        WHERE dp.pedido_id = ?
    """, (pedido_id,))
    detalles = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    
    pedido_dict = dict(pedido)
    pedido_dict['detalles'] = detalles
    
    return pedido_dict

@app.post("/pedidos")
def create_pedido(pedido: PedidoCreate):
    conn = get_db()
    cursor = conn.cursor()
    
    try:
        # Calcular total
        total = 0
        for item in pedido.productos:
            cursor.execute("SELECT precio, stock FROM productos WHERE id = ?", 
                         (item['producto_id'],))
            producto = cursor.fetchone()
            if not producto:
                raise HTTPException(status_code=404, 
                                  detail=f"Producto {item['producto_id']} no encontrado")
            if producto['stock'] < item['cantidad']:
                raise HTTPException(status_code=400, 
                                  detail=f"Stock insuficiente para producto {item['producto_id']}")
            total += producto['precio'] * item['cantidad']
        
        # Crear pedido
        fecha_actual = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute("""
            INSERT INTO pedidos (cliente_id, fecha, total, estado)
            VALUES (?, ?, ?, 'Pendiente')
        """, (pedido.cliente_id, fecha_actual, total))
        pedido_id = cursor.lastrowid
        
        # Crear detalles y actualizar stock
        for item in pedido.productos:
            cursor.execute("SELECT precio FROM productos WHERE id = ?", 
                         (item['producto_id'],))
            precio = cursor.fetchone()['precio']
            
            cursor.execute("""
                INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario)
                VALUES (?, ?, ?, ?)
            """, (pedido_id, item['producto_id'], item['cantidad'], precio))
            
            cursor.execute("""
                UPDATE productos SET stock = stock - ? WHERE id = ?
            """, (item['cantidad'], item['producto_id']))
        
        conn.commit()
        conn.close()
        return {"id": pedido_id, "total": total, "message": "Pedido creado exitosamente"}
    
    except Exception as e:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/pedidos/{pedido_id}")
def delete_pedido(pedido_id: int):
    conn = get_db()
    cursor = conn.cursor()
    
    # Restaurar stock antes de eliminar
    cursor.execute("""
        SELECT producto_id, cantidad FROM detalle_pedido WHERE pedido_id = ?
    """, (pedido_id,))
    detalles = cursor.fetchall()
    
    for detalle in detalles:
        cursor.execute("""
            UPDATE productos SET stock = stock + ? WHERE id = ?
        """, (detalle['cantidad'], detalle['producto_id']))
    
    cursor.execute("DELETE FROM detalle_pedido WHERE pedido_id = ?", (pedido_id,))
    cursor.execute("DELETE FROM pedidos WHERE id = ?", (pedido_id,))
    conn.commit()
    conn.close()
    return {"message": "Pedido eliminado exitosamente"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)