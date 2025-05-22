# **Clase 05: Modelos de Inventarios Determinísticos**

**EOQ, Análisis ABC y Gestión Multi-Producto**

---

## **📌 Introducción**

La gestión óptima de inventarios es como **regular el flujo de agua en una represa**: demasiado genera costos, muy poco causa escasez. Hoy aprenderemos:  
✅ **Análisis ABC** para priorización  
✅ **Modelo EOQ (Lote Económico)**  
✅ **Gestión de múltiples productos**

> **💡 Concepto clave**: _"El inventario es dinero convertido en productos; debemos minimizarlo sin afectar el servicio."_

---

## **📊 Análisis ABC: Clasificación de Inventarios**

### **🔹 Diagrama de Pareto**

```mermaid
pie
    title Distribución ABC Típica
    "Ítems A (15% SKUs, 80% valor)" : 80
    "Ítems B (30% SKUs, 15% valor)" : 15
    "Ítems C (55% SKUs, 5% valor)" : 5
```

### **🔹 Estrategias por Categoría**

| **Categoría** | **Gestión Recomendada**  | **Ejemplo de Política**         |
| ------------- | ------------------------ | ------------------------------- |
| **A**         | Revisión continua (s,Q)  | Pedidos automáticos con EOQ     |
| **B**         | Revisión periódica (T,Q) | Órdenes mensuales con ajuste    |
| **C**         | Pedidos consolidados     | Compras semestrales por volumen |

#### Revision periódica (T,Q)

Se revisa el nivel de inventario cada T días y se ordena una cantidad Q para reabastecer hasta un nivel predeterminado.

#### Revisión continua (s,Q)

Se revisa el nivel de inventario continuamente y se ordena una cantidad Q cuando el inventario cae por debajo de un nivel crítico s (**ROP**).

**📌 Caso Real**: _Walmart usa análisis ABC para priorizar reposición en tiendas (los ítems A tienen stock diario, los C se reponen semanalmente)._

---

## **⚡ Modelo EOQ (Lote Económico)**

### **🔹 Fórmulas Clave**

$$
Q^* = \sqrt{\frac{2DS}{H}} \quad \text{(Cantidad óptima)}
$$

$$

C_T = \frac{DS}{Q} + \frac{HQ}{2} + PD \quad \text{(Costo total anual)}
$$

Con

- $D$ = Demanda anual
- $S$ = Costo por pedido (setup)
- $H$ = Costo de mantención por unidad (inventario)
- $P$ = Precio por unidad
- $Q$ = Cantidad por pedido
- $C_T$ = Costo total anual

### **🔹 Ejemplo Numérico**

Una empresa tiene:

- Demanda anual: D = **1000 unidades**
- Costo unitario: P = **$500**
- Costo por pedido: S = **$100**
- Costo de mantención: H = 1% del costo unitario - $H = 0.01 \times P = \$5$

**Cálculos**:

1. **Cantidad óptima**:
   $$Q^* = \sqrt{\frac{2DS}{H}} = \sqrt{\frac{2 \times 1000 \times 100}{5}} = 200 \text{ unidades}$$
2. **Costo total anual**:
   $$C_T = \frac{DS}{Q} + \frac{HQ}{2} + PD = \frac{1000 \times 100}{200} + \frac{5 \times 200}{2} = \$500 + \$500= \$1000$$

- PD escondido por sensibilidad.

---

## **📈 Punto de Reorden (ROP)**

### **🔹 Cálculo Básico**

$$
ROP = d \times T_s \quad \text{(Demanda diaria × Tiempo de entrega)}
$$

**Ejemplo**:

- $D = 1000 \text{ un/año}$ → $d = 4 \text{ un/día}$ 
- $T_s = 10 \text{ días}$ → $ROP = 40 \text{ un}$

### **🔹 Caso $T_s > T_c$**

$$
ROP = d \times \left(T_s - \left\lfloor \frac{T_s}{T_c} \right\rfloor \times T_c \right)
$$

**Ejemplo**:

- $T_s = 60 \text{ días}, T_c = 50 \text{ días}$ → $ROP = 40 \text{ un}$

---

## **🔄 Gestión de Múltiples Productos**

### **🔹 Modelo con Restricción de Espacio**

$$
\text{Minimizar } C_T = \sum_{i=1}^n \left(\frac{S_i D_i}{Q_i} + \frac{H_i Q_i}{2}\right)
$$

$$

\text{Sujeto a } \sum_{i=1}^n Q_i v_i \leq A \quad \text{(A = espacio disponible)}
$$

### **🔹 Ejemplo Práctico**

| **Producto** | **Demanda (D)** | **Costo Pedido (S)** | **Volumen (v)** |
| ------------ | --------------- | -------------------- | --------------- |
| X            | 500             | $50                  | 0.5 m³          |
| Y            | 300             | $30                  | 0.3 m³          |

**Solución**: Usar **multiplicadores de Lagrange** para optimizar $Q_X$ y $Q_Y$ dentro de $A = 100 \text{ m³}$.

---

## **📌 Conclusiones**

✔ **EOQ** equilibra costos de pedido y mantención.
✔ **ROP** asegura stock durante el tiempo de entrega.
✔ **ABC** prioriza recursos en ítems críticos.

**🔍 Recursos Adicionales**:

- Libro: **Capítulo 17** de _"Administración de Operaciones"_ (Chase).
- Calculadora EOQ: [Plantilla Excel en Canvas](link).
- Video: **"Cómo Amazon aplica EOQ"** (YouTube).

---

**🏆 Ejercicio Propuesto**:
Una empresa tiene:

- $D = 2000 \text{ un/año}$, $S = \$75$, $H = \$3 \text{ un/año}$. 
- $T_s = 15 \text{ días}$, año laboral = 250 días.

**Preguntas**:

1. Calcule $Q^*$ y $C_T$.
2. Determine el ROP.

_(Solución: $Q^* = 316 \text{ un}, C_T = \$949, ROP = 120 \text{ un}$)_.
