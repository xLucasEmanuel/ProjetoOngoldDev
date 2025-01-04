const history = [] // Array para armazenar o histórico de buscas
async function chamarApi(ean) {
  const URL = `https://painel.ongoldtech.com/api/tests/public/buscapreco?ean=${ean}`

  try {
    const respApi = await fetch(URL)

    if (respApi.status === 200) {
      const obj = await respApi.json()
      listarProduto(obj)
      adicionarAoHistorico(ean) // Adiciona o código ao histórico
    } else {
      exibirErro('Produto não encontrado ou código EAN inválido.')
    }
  } catch (error) {
    exibirErro('Erro ao buscar os dados. Verifique sua conexão com a internet.')
  }
}

function listarProduto(produto) {
  const container = document.getElementById('productContainer')

  const productHTML = `
  <div class="product">
    <h2>${produto.nome || 'Nome indisponível'}</h2>
    <p><strong>Preço:</strong> R$ ${produto.preco || 'N/A'}</p>
    <img src="${
      produto.imagem || 'https://via.placeholder.com/150'
    }" alt="Imagem do Produto" style="max-width: 150px;">
  </div>
`

  container.innerHTML = productHTML
}

function exibirErro(mensagem) {
  const container = document.getElementById('productContainer')
  container.innerHTML = `<p class="error">${mensagem}</p>`
}

function adicionarAoHistorico(ean) {
  if (!history.includes(ean)) {
    history.push(ean) // Adiciona o código EAN ao histórico
    atualizarHistorico()
  }
}
function buscarProduto() {
  const eanInput = document.getElementById('eanInput')
  const ean = eanInput.value.trim()
  if (ean) {
    chamarApi(ean)
  } else {
    exibirErro('Por favor, insira um código EAN válido')
  }
}
function atualizarHistorico() {
  const historyContainer = document.getElementById('historyContainer')

  if (history.length === 0) {
    historyContainer.innerHTML = 'Nenhuma busca realizada ainda.'
    return
  }

  historyContainer.innerHTML = history
    .map(
      ean => `<p class="history-item" onclick="chamarApi('${ean}')">${ean}</p>`
    )
    .join('')
}

function limparHistorico() {
  history.length = 0 // Limpa o array de histórico
  atualizarHistorico() // Atualiza a interface
}

// Adiciona o evento ao botão de busca
const searchButton = document.getElementById('searchButton')
searchButton.addEventListener('click', () => {
  const eanInput = document.getElementById('eanInput')
  const ean = eanInput.value.trim()

  if (ean) {
    chamarApi(ean)
  } else {
    exibirErro('Por favor, insira um código EAN válido.')
  }
})
const eanInput = document.getElementById('eanInput')
eanInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    buscarProduto()
  }
})

// Adiciona o evento ao botão de limpar histórico
const clearHistoryButton = document.getElementById('clearHistoryButton')
clearHistoryButton.addEventListener('click', limparHistorico)
