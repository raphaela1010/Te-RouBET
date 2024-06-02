document.addEventListener("DOMContentLoaded", function() {
    const bodyId = document.body.id;
    const navLinks = document.querySelectorAll("nav a");

    // Adiciona a classe 'active' ao link de navegação correto
    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if ((bodyId === "pagina-inicial" && href === "index.html") ||
            (bodyId === "pagina-cadastro" && href === "cadastro.html") ||
            (bodyId === "pagina-login" && href === "login.html") ||
            (bodyId === "pagina-apostas" && href === "apostas.html")) {
            link.classList.add("active");
        }
    });

    // Função para manipular o cadastro
    if (bodyId === "pagina-cadastro") {
        const cadastroForm = document.getElementById("cadastroForm");
        cadastroForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const nomeCompleto = document.getElementById("nomeCompleto").value;
            const dataNascimento = new Date(document.getElementById("dataNascimento").value);
            const usuario = document.getElementById("usuario").value;
            const senha = document.getElementById("senha").value;
            const cupomPromocional = document.getElementById("cupomPromocional").value;

            const hoje = new Date();
            let idade = hoje.getFullYear() - dataNascimento.getFullYear();
            const mes = hoje.getMonth() - dataNascimento.getMonth();
            if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
                idade--;
            }

            if (idade < 18) {
                alert("Você precisa ser maior de 18 anos para se cadastrar.");
                return;
            }

            // Validar o cupom promocional
            let credito = 0;
            if (cupomPromocional === 'FU1_4SS4LT4D0') {
                credito = 50;
            }

            // Salvar as informações do usuário no localStorage
            const usuarioDados = {
                nomeCompleto,
                dataNascimento: dataNascimento.toISOString(),
                usuario,
                senha,
                credito
            };

            localStorage.setItem('usuario_' + usuario, JSON.stringify(usuarioDados));

            alert("Cadastro realizado com sucesso!");
            window.location.href = "login.html";
        });
    }

    // Funções e eventos para a página inicial
    if (bodyId === "pagina-inicial") {
        document.querySelectorAll('.bonus-option').forEach(option => {
            option.addEventListener('mouseenter', function() {
                this.classList.add('hovered');
            });
            option.addEventListener('mouseleave', function() {
                this.classList.remove('hovered');
            });
        });

        const cadastreSeButton = document.getElementById('cadastreSeButton');
        if (cadastreSeButton) {
            cadastreSeButton.addEventListener('click', function() {
                window.location.href = 'cadastro.html';
            });
        }
    }

    // Função para o login
    if (bodyId === "pagina-login") {
        const loginForm = document.getElementById("loginForm");
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const nomeUsuario = document.getElementById("nomeUsuarioLogin").value;
            const senha = document.getElementById("senhaLogin").value;

            // Carregar os dados do usuário do localStorage
            const usuarioDados = JSON.parse(localStorage.getItem('usuario_' + nomeUsuario));

            if (usuarioDados && usuarioDados.senha === senha) {
                localStorage.setItem("logado", "true");
                localStorage.setItem("usuarioLogado", nomeUsuario);
                alert("Login realizado com sucesso! Seu crédito é: R$" + usuarioDados.credito);

                // Redirecionar para a página de apostas ou outra página
                window.location.href = "apostas.html";
            } else {
                alert("Nome de usuário ou senha incorretos!");
            }
        });
    }

    // Função para a página de apostas
    if (bodyId === "pagina-apostas") {
        const forms = document.querySelectorAll("form");
        forms.forEach(form => {
            form.addEventListener("submit", function(event) {
                const match = form.querySelector("h3").textContent;
                const odds = {};
                form.querySelectorAll("label input[type='radio']").forEach(radio => {
                    odds[radio.value] = parseFloat(radio.parentElement.querySelector(".odd").textContent.replace("(ODD: ", "").replace(")", ""));
                });
                placeBet(event, match, odds);
            });

            form.querySelectorAll("input[type='radio']").forEach(radio => {
                radio.addEventListener("change", function() {
                    updatePotentialWin(form);
                });
            });

            form.querySelector("input[name='amount']").addEventListener("input", function() {
                updatePotentialWin(form);
            });
        });
    }
});

// Função para atualizar o potencial de ganho na página de apostas
function updatePotentialWin(form) {
    const selectedTeam = form.querySelector("input[name='team']:checked")?.value;
    const amount = parseFloat(form.querySelector("input[name='amount']").value);
    const odds = {
        "São Paulo": 2.50,
        "Corinthians": 4.70,
        "Empate": 3.00,
        "Palmeiras": 1.80,
        "Santos": 7.20,
        "Empate": 3.50
    };
    if (selectedTeam && !isNaN(amount)) {
        const potentialWin = amount * odds[selectedTeam];
        const potentialWinSpan = form.querySelector(".potential-win span");
        potentialWinSpan.textContent = `R$${potentialWin.toFixed(2)}`;
    } else {
        const potentialWinSpan = form.querySelector(".potential-win span");
        potentialWinSpan.textContent = "R$0.00";
    }
}

// Função para realizar a aposta
function placeBet(event, match, odds) {
    event.preventDefault();
    const form = event.target;
    const selectedTeam = form.querySelector("input[name='team']:checked").value;
    const amount = parseFloat(form.querySelector("input[name='amount']").value);
    const potentialWin = amount * odds[selectedTeam];
    alert(`Você apostou R$${amount.toFixed(2)} no ${selectedTeam} para o jogo ${match}. Potencial de ganho: R$${potentialWin.toFixed(2)}`);
}
