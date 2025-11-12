import sqlite3

def init_database():
    conn = sqlite3.connect("fitness_store.db")
    cursor = conn.cursor()
    
    # Crear tabla de categorías
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT
    )
    """)
    
    # Crear tabla de productos
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        precio REAL NOT NULL,
        stock INTEGER NOT NULL,
        categoria_id INTEGER,
        imagen_url TEXT,
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    )
    """)
    
    # Crear tabla de clientes
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        telefono TEXT,
        direccion TEXT
    )
    """)
    
    # Crear tabla de pedidos
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        fecha TEXT NOT NULL,
        total REAL NOT NULL,
        estado TEXT DEFAULT 'Pendiente',
        FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    )
    """)
    
    # Crear tabla de detalle de pedidos (relación muchos a muchos entre pedidos y productos)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS detalle_pedido (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pedido_id INTEGER NOT NULL,
        producto_id INTEGER NOT NULL,
        cantidad INTEGER NOT NULL,
        precio_unitario REAL NOT NULL,
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
        FOREIGN KEY (producto_id) REFERENCES productos(id)
    )
    """)
    
    # Verificar si ya hay datos
    cursor.execute("SELECT COUNT(*) FROM categorias")
    if cursor.fetchone()[0] > 0:
        print("⚠️  La base de datos ya contiene datos. No se insertarán duplicados.")
        conn.close()
        return
    
    # Insertar categorías
    categorias = [
        ("Proteínas", "Suplementos proteicos para construcción muscular"),
        ("Pre-Entreno", "Suplementos energéticos para antes del entrenamiento"),
        ("Vitaminas", "Suplementos vitamínicos y minerales"),
        ("Creatina", "Suplementos de creatina para fuerza y rendimiento"),
        ("Aminoácidos", "BCAA y otros aminoácidos esenciales")
    ]
    
    cursor.executemany("INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)", categorias)
    
    # Insertar productos (al menos 10)
    productos = [
        ("Whey Protein Isolate", "Proteína aislada de suero de leche, 90% pureza", 4500.00, 50, 1, "https://images.unsplash.com/photo-1593095948071-474c5cc2989d"),
        ("Whey Protein Concentrate", "Proteína concentrada de suero, sabor chocolate", 3200.00, 75, 1, "https://images.unsplash.com/photo-1579722820308-d74e571900a9"),
        ("Proteína Vegana", "Mezcla de proteínas vegetales, sin lácteos", 3800.00, 40, 1, "https://images.unsplash.com/photo-1610441009633-9b4e4cbb6d0d"),
        ("Pre-Workout Extreme", "Fórmula pre-entreno con cafeína y beta-alanina", 2800.00, 60, 2, "https://images.unsplash.com/photo-1526401485004-46910ecc8e51"),
        ("Creatina Monohidrato", "Creatina pura micronizada, 300g", 1500.00, 100, 4, "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5"),
        ("BCAA 2:1:1", "Aminoácidos ramificados, 300 cápsulas", 2200.00, 80, 5, "https://images.unsplash.com/photo-1505751172876-fa1923c5c528"),
        ("Glutamina Pure", "L-Glutamina pura, 500g", 1800.00, 65, 5, "https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6"),
        ("Multivitamínico Premium", "Complejo vitamínico completo, 60 cápsulas", 1200.00, 90, 3, "https://images.unsplash.com/photo-1550572017-edd951aa8f72"),
        ("Omega 3 Fish Oil", "Aceite de pescado rico en EPA y DHA", 1600.00, 70, 3, "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2"),
        ("ZMA Complex", "Zinc, Magnesio y Vitamina B6, 90 cápsulas", 1400.00, 55, 3, "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136"),
        ("Caseína Micelar", "Proteína de absorción lenta, ideal para la noche", 4200.00, 45, 1, "https://images.unsplash.com/photo-1594737625785-8e8f0e5e5e5e"),
        ("Beta Alanina", "Mejora resistencia y reduce fatiga muscular", 1700.00, 50, 2, "https://images.unsplash.com/photo-1599932595450-13f1b6e1c8b0")
    ]
    
    cursor.executemany("""
        INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, imagen_url)
        VALUES (?, ?, ?, ?, ?, ?)
    """, productos)
    
    # Insertar clientes (al menos 10)
    clientes = [
        ("Juan Pérez", "juan.perez@email.com", "381-5551234", "Av. Aconquija 1200, Tucumán"),
        ("María González", "maria.gonzalez@email.com", "381-5555678", "Calle San Martín 450, Tucumán"),
        ("Carlos Rodríguez", "carlos.rodriguez@email.com", "381-5559876", "Av. Mate de Luna 2500, Tucumán"),
        ("Ana Martínez", "ana.martinez@email.com", "381-5553456", "Calle Las Heras 780, Tucumán"),
        ("Luis Fernández", "luis.fernandez@email.com", "381-5557890", "Av. Roca 1500, Tucumán"),
        ("Laura Sánchez", "laura.sanchez@email.com", "381-5552345", "Barrio Jardín 340, Tucumán"),
        ("Diego Ramírez", "diego.ramirez@email.com", "381-5558901", "Calle Córdoba 920, Tucumán"),
        ("Sofía Torres", "sofia.torres@email.com", "381-5554567", "Av. Sarmiento 670, Tucumán"),
        ("Martín López", "martin.lopez@email.com", "381-5556789", "Barrio Norte 1100, Tucumán"),
        ("Valentina Castro", "valentina.castro@email.com", "381-5551111", "Calle 25 de Mayo 550, Tucumán"),
        ("Fernando Díaz", "fernando.diaz@email.com", "381-5552222", "Av. Belgrano 890, Tucumán"),
        ("Carolina Ruiz", "carolina.ruiz@email.com", "381-5553333", "Barrio San Pablo 230, Tucumán")
    ]
    
    cursor.executemany("""
        INSERT INTO clientes (nombre, email, telefono, direccion)
        VALUES (?, ?, ?, ?)
    """, clientes)
    
    # Insertar pedidos de ejemplo
    pedidos = [
        (1, "2025-11-01 10:30:00", 7700.00, "Completado"),
        (2, "2025-11-02 14:15:00", 6000.00, "Completado"),
        (3, "2025-11-03 09:20:00", 4500.00, "En Proceso"),
        (4, "2025-11-04 16:45:00", 8200.00, "Completado"),
        (5, "2025-11-05 11:00:00", 3200.00, "Pendiente"),
        (6, "2025-11-06 13:30:00", 5800.00, "Completado"),
        (7, "2025-11-07 15:20:00", 7000.00, "En Proceso"),
        (8, "2025-11-08 10:10:00", 4600.00, "Completado"),
        (9, "2025-11-09 12:45:00", 6800.00, "Pendiente"),
        (10, "2025-11-10 14:00:00", 9200.00, "Completado")
    ]
    
    cursor.executemany("""
        INSERT INTO pedidos (cliente_id, fecha, total, estado)
        VALUES (?, ?, ?, ?)
    """, pedidos)
    
    # Insertar detalles de pedidos (relación muchos a muchos)
    detalles = [
        # Pedido 1: Juan Pérez - Total: 7700
        (1, 1, 1, 4500.00),   # Whey Isolate x1
        (1, 4, 1, 2800.00),   # Pre-Workout x1
        (1, 8, 1, 1200.00),   # Multivitamínico x1
        # Pedido 2: María González - Total: 6000
        (2, 2, 1, 3200.00),   # Whey Concentrate x1
        (2, 5, 1, 1500.00),   # Creatina x1
        (2, 10, 1, 1400.00),  # ZMA x1
        # Pedido 3: Carlos Rodríguez - Total: 4500
        (3, 1, 1, 4500.00),   # Whey Isolate x1
        # Pedido 4: Ana Martínez - Total: 8200
        (4, 3, 1, 3800.00),   # Proteína Vegana x1
        (4, 4, 1, 2800.00),   # Pre-Workout x1
        (4, 9, 1, 1600.00),   # Omega 3 x1
        # Pedido 5: Luis Fernández - Total: 3200
        (5, 2, 1, 3200.00),   # Whey Concentrate x1
        # Pedido 6: Laura Sánchez - Total: 5800
        (6, 6, 1, 2200.00),   # BCAA x1
        (6, 7, 2, 1800.00),   # Glutamina x2
        # Pedido 7: Diego Ramírez - Total: 7000
        (7, 1, 1, 4500.00),   # Whey Isolate x1
        (7, 5, 1, 1500.00),   # Creatina x1
        (7, 12, 1, 1700.00),  # Beta Alanina x1
        # Pedido 8: Sofía Torres - Total: 4600
        (8, 8, 2, 1200.00),   # Multivitamínico x2
        (8, 9, 1, 1600.00),   # Omega 3 x1
        (8, 7, 1, 1800.00),   # Glutamina x1
        # Pedido 9: Martín López - Total: 6800
        (9, 1, 1, 4500.00),   # Whey Isolate x1
        (9, 6, 1, 2200.00),   # BCAA x1
        # Pedido 10: Valentina Castro - Total: 9200
        (10, 11, 2, 4200.00), # Caseína x2
        (10, 12, 1, 1700.00)  # Beta Alanina x1
    ]
    
    cursor.executemany("""
        INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario)
        VALUES (?, ?, ?, ?)
    """, detalles)
    
    conn.commit()
    conn.close()
    
    print("✅ Base de datos inicializada exitosamente!")
    print("📊 Tablas creadas: categorias, productos, clientes, pedidos, detalle_pedido")
    print("📦 Datos insertados:")
    print("   - 5 categorías")
    print("   - 12 productos")
    print("   - 12 clientes")
    print("   - 10 pedidos")
    print("   - 21 detalles de pedido")
    print("\n🚀 Ejecuta 'python main.py' para iniciar el servidor FastAPI")

if __name__ == "__main__":
    init_database()