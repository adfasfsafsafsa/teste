// Lista de produtos
const products = [
    { id: 1, name: 'Arroz', price: 5.99, img: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Feijão', price: 4.99, img: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Macarrão', price: 3.99, img: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Óleo', price: 7.99, img: 'https://via.placeholder.com/150' }
];

let selectedProductId = null;  // Guardará o ID do produto selecionado
let selectedQuantity = 1;      // Guardará a quantidade escolhida

// Carregar os produtos na tela
function loadProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Limpar a lista antes de recarregar
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('col-md-3', 'product-card');
        productCard.innerHTML = `
            <div class="card">
                <img src="${product.img}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">R$ ${product.price.toFixed(2)}</p>
                    <!-- Botão para selecionar a quantidade -->
                    <button class="btn btn-outline-secondary" onclick="openQuantityModal(${product.id})">
                        Selecione a Quantidade
                    </button>
                    <button class="btn btn-primary mt-2" onclick="addToCart(${product.id})">
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        `;
        productList.appendChild(productCard);
    });
}

// Abrir o modal para selecionar a quantidade
function openQuantityModal(productId) {
    selectedProductId = productId; // Guardar o ID do produto selecionado

    // Gerar as opções de quantidade (1 a 10)
    const quantityOptions = document.getElementById('quantity-options');
    quantityOptions.innerHTML = ''; // Limpar as opções anteriores

    // Criar botões para quantidades de 1 a 10
    for (let i = 1; i <= 10; i++) {
        const optionButton = document.createElement('button');
        optionButton.classList.add('btn', 'btn-outline-primary', 'm-1');
        optionButton.textContent = i;
        optionButton.onclick = () => selectQuantity(i); // Chama a função de selecionar quantidade
        quantityOptions.appendChild(optionButton);
    }

    // Exibir o modal para selecionar a quantidade
    $('#quantityModal').modal('show');
}

// Selecionar a quantidade e atualizar o botão
function selectQuantity(quantity) {
    selectedQuantity = quantity; // Armazenar a quantidade selecionada
    const applyButton = document.getElementById('apply-quantity-btn');
    applyButton.disabled = false; // Habilitar o botão para aplicar a quantidade
}

// Aplicar a quantidade escolhida e fechar o modal
document.getElementById('apply-quantity-btn').addEventListener('click', () => {
    // Atualizar o botão de quantidade do produto com a quantidade escolhida
    const quantityButton = document.querySelector(`button[onclick="openQuantityModal(${selectedProductId})"]`);
    quantityButton.textContent = `Quantidade: ${selectedQuantity}`; // Atualiza o texto do botão
    $('#quantityModal').modal('hide'); // Fechar o modal após a escolha
});

// Adicionar o produto ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId); // Encontre o produto na lista
    if (!product) return; // Se o produto não for encontrado, não faz nada

    // Carregar o carrinho do localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Verificar se o produto já está no carrinho
    const existingProduct = cart.find(item => item.id === productId);

    // Se o produto já estiver no carrinho, atualize a quantidade
    if (existingProduct) {
        existingProduct.quantity += selectedQuantity;
    } else {
        // Caso contrário, adicione o produto com a quantidade selecionada
        cart.push({ ...product, quantity: selectedQuantity });
    }

    // Atualizar o carrinho no localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Atualizar a exibição do carrinho
    updateCart();

    // Exibir uma mensagem de confirmação
    showMessage(`${product.name} - Quantidade ${selectedQuantity} adicionada ao carrinho!`);
}

// Função para exibir a mensagem de confirmação
function showMessage(message) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('alert', 'alert-success', 'alert-dismissible', 'fade', 'show');
    messageContainer.role = 'alert';
    messageContainer.innerHTML = `${message} <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>`;

    const container = document.querySelector('.container');
    container.insertBefore(messageContainer, container.firstChild);

    // Remover a mensagem após 5 segundos
    setTimeout(() => {
        messageContainer.classList.remove('show');
    }, 5000);
}

// Função para atualizar o carrinho e mostrar os itens e o total
function updateCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    cartItems.innerHTML = ''; // Limpar o carrinho antes de atualizar
    let totalItems = 0;
    let totalPrice = 0;

    // Verificar se o carrinho está vazio
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Seu carrinho está vazio.</p>';
    } else {
        cart.forEach(item => {
            totalItems += item.quantity; // Contabiliza a quantidade de itens
            totalPrice += item.quantity * item.price; // Calcula o preço total

            // Exibe cada item no carrinho
            const cartItem = document.createElement('div');
            cartItem.classList.add('d-flex', 'justify-content-between', 'mb-2');
            cartItem.innerHTML = `
                <span>${item.name} - ${item.quantity} x R$ ${item.price.toFixed(2)}</span>
                <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">Remover</button>
            `;
            cartItems.appendChild(cartItem);
        });
    }

    // Atualizar o contador de itens e o total do carrinho
    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice.toFixed(2);
}

// Função para remover um item do carrinho
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId); // Filtra o item a ser removido
    localStorage.setItem('cart', JSON.stringify(cart)); // Atualiza o carrinho no localStorage
    updateCart(); // Atualiza a exibição do carrinho
}

// Finalizar a compra (limpar carrinho)
document.getElementById('checkout-btn').addEventListener('click', () => {
    localStorage.removeItem('cart'); // Limpa o carrinho
    updateCart(); // Atualiza a exibição do carrinho
    alert('Compra finalizada com sucesso!');
});

// Carregar os produtos e o carrinho ao iniciar a página
window.onload = function() {
    loadProducts();  // Carregar os produtos na página
    updateCart();    // Atualizar a exibição do carrinho
};
