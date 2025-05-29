/**
 * Este archivo contiene el componente EditProducts
 * que muestra una lista de productos editables.
 * Utiliza el contexto de productos para obtener los datos.
 */

import { useProductContext } from '../context/ProductContext';

export default function EditProducts() {
    const { products } = useProductContext();

    return (
        <div>
            <h1>Editar productos</h1>
            <ul>
                {/* mostrar todos los datos */}
                {products.map((p) => (
                    // mostrar todos los datos del producto
                    <li key={p.key_unique}>
                        <strong>ID:</strong> {p.id} <br />
                        <strong>Nombre:</strong> {p.nombre} <br />
                        <strong>Clave:</strong> {p.clave} <br />
                        <strong>Unidad de medida:</strong> {p.unidad_medida} <br />
                        {/* <strong>Precio sugerido:</strong> ${p.precio_sugerido.toFixed(2)} <br /> */}
                        {/* <strong>Precio actual:</strong> ${p.precio_actual.toFixed(2)} <br /> */}
                        <strong>Inventario actual:</strong> {p.inventario_actual} <br />
                        <strong>Categoría:</strong> {p.categoria || 'N/A'} <br />
                        <strong>Inventario original:</strong> {p.inventario_original} <br />
                        <strong>Modificado:</strong> {p.modificado ? 'Sí' : 'No'} <br />
                    </li>
                ))}
            </ul>
        </div>
    );
}
