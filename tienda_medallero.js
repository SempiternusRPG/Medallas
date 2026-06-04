let carrito = [];
let productoSeleccionado = null;

function obtenerCategorias() {
  return [...new Set(productos.map((p) => p.categoria))];
}

function obtenerSubcategorias(categoria) {
  return [
    ...new Set(
      productos
        .filter((p) => p.categoria === categoria && p.subcategoria)
        .map((p) => p.subcategoria)
    )
  ];
}

// Mostrar productos
function renderProductos() {
  $("#sem-productos").html("");

  const categorias = obtenerCategorias();

  categorias.forEach((categoria) => {
    const idCategoria = normalizarId(categoria);

    // contenedor de categoría
    $("#sem-productos").append(`
      <div class="categoria">
        <h2>${categoria}</h2>
        <div id="cat-${idCategoria}"></div>
      </div>
    `);

    const subcategorias = obtenerSubcategorias(categoria);

    // ???? si tiene subcategorías
    if (subcategorias.length > 0) {
      subcategorias.forEach((sub) => {
        const idSub = normalizarId(sub);

        $(`#cat-${idCategoria}`).append(`
          <div class="subcategoria">
            <h3>${sub}</h3>
            <div id="sub-${idCategoria}-${idSub}" class="contenedor-productos"></div>
          </div>
        `);

        productos.forEach((p, index) => {
          if (p.categoria === categoria && p.subcategoria === sub) {
            if (p.evidencia) {
              $(`#sub-${idCategoria}-${idSub}`).append(`
              <div class="medalla-sem">
                <h4><span>${p.nombre}</span></h4>
                <div>
                <div class="sem-me-img"><img src="${p.imagen}"/></div>
                <div class="sem-me-desc">${p.descripcion}</div>
                </div>
                <button class="btn-agregar" onClick="abrirModal(${index})">
                  Agregar
                </button>
              </div>
            `);
            } else {
              $(`#sub-${idCategoria}-${idSub}`).append(`
              <div class="medalla-sem">
                <h4><span>${p.nombre}</span></h4>
                <div>
                <div class="sem-me-img"><img src="${p.imagen}"/></div>
                <div class="sem-me-desc">${p.descripcion}</div>
                </div>
                <button class="btn-agregar" onClick="agregar_carrito(${index})">
                  Agregar
                </button>
              </div>`);
            }
          }
        });
      });
    } else {
      // ???? categoría sin subcategoría
      $(`#cat-${idCategoria}`).append(`
        <div class="contenedor-productos" id="solo-${idCategoria}"></div>
      `);

      productos.forEach((p, index) => {
        if (p.categoria === categoria) {
          $(`#solo-${idCategoria}`).append(`
            <div class="medalla-sem">
                <h4><span>${p.nombre}</span></h4>
                <div>
                <div class="sem-me-img"><img src="${p.imagen}"/></div>
                <div class="sem-me-desc">${p.descripcion}</div>
                </div>
                <button class="btn-agregar" onClick="abrirModal(${index})">
                  Agregar
                </button>
              </div>
          `);
        }
      });
    }
  });
}

function normalizarId(texto) {
  return texto.replace(/\s+/g, "-").toLowerCase();
}
// abrir modal
function abrirModal(index) {
  const producto = productos[index];
  productoSeleccionado = producto;

  $("#modal-producto").text(producto.nombre);
  $("#modal").show();
  $("#modal-evidencia").val("");
}

$(document).ready(function () {
  $("#cerrar").click(function () {
    $("#modal").hide();
  });
});

// logica carrito
$(document).on("click", "#confirmar", function () {
  const evidencia = $("#modal-evidencia").val().trim();
  if (!evidencia) {
    alert("Debes colocar el link del tema o captura que evidencie que cumples el requisito para obtener la medalla solicitada.");
    return;
  }
  carrito.push({
    id: productoSeleccionado.id,
    nombre: productoSeleccionado.nombre,
    categoria: productoSeleccionado.categoria,
    subcategoria: productoSeleccionado.subcategoria,
    precio: productoSeleccionado.subcategoria == "suma" ? productoSeleccionado.precio : evidencia !== "" ? 0 : productoSeleccionado.precio,
    evidencia
  });
  $("#modal").hide();
  renderCarrito();
});

function agregar_carrito(index) {
  const producto = productos[index];
  productoSeleccionado = producto;

  carrito.push({
    id: productoSeleccionado.id,
    nombre: productoSeleccionado.nombre,
    categoria: productoSeleccionado.categoria,
    subcategoria: productoSeleccionado.subcategoria,
    precio: productoSeleccionado.precio
  });

  renderCarrito();
}

function eliminarItem(index) {
  carrito.splice(index, 1);
  renderCarrito();
}

function renderCarrito() {
  $("#carrito").html("");
  if (carrito.length === 0) {
    $("#carrito").html("<p>El carrito está vacío</p>");
    return;
  }
  carrito.forEach((item, index) => {
    $("#carrito").append(`
      <div class="carrito-item">
        <h4>${item.nombre}<\/h4>
        <p><strong>Categoria:<\/strong> ${item.categoria}<\/p>
        <p><strong>Evidencia:<\/strong> ${
          item.evidencia || "sin evidencia"
        }<\/p>
        <p><strong>Precio:<\/strong> ${item.precio} kr<\/p>
        <button onclick="eliminarItem(${index})" title="Eliminar item del carrito"><i class="fi fi-sr-delete"><\/i><\/button>
      <\/div>
    `);
  });

  // total
  const total = carrito.reduce((acc, item) => {
    if(item.subcategoria === "suma") {
      return acc + item.precio;
    }
    return acc - item.precio;
  }, 0);

  if (carrito.length > 0) {
    $("#carrito").append(
      `<h3>Total: ${total} kr<\/h3><input name="post" value="Terminar la compra" type="submit" \/>`
    );
  }
}

function ver_carrito() {
  $("#carrito-contenedor")[0].classList.toggle("ocultar");
}
var auth1;
var auth2;

jQuery(function () {
  var id_tema = 21; //ID del tema donde queremos que se cree el tema
  jQuery("#hidden").load(
    "/post?t=" + id_tema + "&mode=reply form[action='/post']"
  );
});

function generarTextoCarrito() {
  let texto = `<b>Nombre del Personaje<\/b>: ` + _userdata.username + `\n`;
  carrito.forEach((item, index) => {
    texto += `<b>Nombre de la medalla<\/b>: ${item.nombre}\n`;
    texto += `<b>Categoria<\/b>: ${item.categoria}\n`;
    texto += `<b>Subcategoria<\/b>: ${item.subcategoria}\n`;
    if (item.evidencia) {
      texto += `<b>Evidencia<\/b>:<a href="${item.evidencia}">evidencia</a>\n`;
    }
    texto += `<b>Coronas<\/b>: ${item.precio} kr\n\n`;
  });
  const total = carrito.reduce((acc, item) => {
    if(item.subcategoria === "suma") {
      return acc + item.precio;
    }
    return acc - item.precio;}, 0);
  texto += `<b>Total<\/b>: ${total} kr`;
  return texto;
}

function enviarMensaje(form) {
  // Crear mensaje a partir de los datos suministrados
  var txt_message = generarTextoCarrito();
  // Ahora se insertará todo lo que hayamos metido en el formulario
  form.message.value = txt_message;
  jQuery("#hidden")
    .find("input[name='auth[]']")
    .each(function (index) {
      if (index == 0) auth1 = jQuery(this).attr("value");
      if (index == 1) auth2 = jQuery(this).attr("value");
    });
  jQuery("input#auth1").attr("value", auth1);
  jQuery("input#auth2").attr("value", auth2);
  jQuery("input#lt1").attr(
    "value",
    jQuery("#hidden").find("input[name='lt']").attr("value")
  );
  jQuery("input#mt").attr(
    "value",
    jQuery("#hidden").find("input[name='t']").attr("value")
  );
}

// Init
$(document).ready(function () {
  renderProductos();
  renderCarrito();
});
