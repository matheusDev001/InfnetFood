#Observações
- **Usuario mockado
- **Login: usuario@gmail.com
- **Senha: 123456

# Projeto Mobile – Carrinho e Checkout

Este projeto implementa um sistema de **carrinho de compras** e **finalização de pedidos** em **React Native**, utilizando **AsyncStorage** para persistência de dados e suporte a **tema claro/escuro** através de um contexto global (`ThemeContext`).

## Telas Principais

### Carrinho (CartScreen)

A tela do carrinho permite:

- **Visualizar produtos:** Cada item exibe imagem, nome, preço e quantidade.
- **Ajustar quantidade:** Incrementar ou decrementar a quantidade do produto, com quantidade mínima de 1.
- **Excluir produtos:** Através de swipe, os produtos podem ser removidos do carrinho.
- **Calcular total:** Valor total do carrinho é calculado dinamicamente.
- **Navegação para checkout:** Permite revisar o pedido antes de finalizar.

O design se adapta ao **modo claro ou escuro**, alterando cores de fundo, textos e botões.

### Checkout (CheckoutScreen)

A tela de checkout permite:

- **Revisar pedidos:** Exibe os itens do carrinho detalhados com quantidade e preço.
- **Formulário de dados:** O usuário informa o endereço de entrega e escolhe o método de pagamento via `Picker`.
- **Validação de formulário:** Campos obrigatórios são validados, exibindo mensagens de erro.
- **Cálculo do total geral:** Soma todos os itens dos pedidos.
- **Confirmação e finalização:** Um alerta solicita confirmação antes de concluir o pedido.
- **Persistência e limpeza:** Ao finalizar, os pedidos são salvos em `revisedOrders` e o carrinho é limpo.

O layout também respeita o **tema claro/escuro**, garantindo contraste e legibilidade.

## Tecnologias e Bibliotecas

- **React Native** – Desenvolvimento mobile.
- **AsyncStorage** – Armazenamento local de dados.
- **react-hook-form** – Gestão e validação de formulários.
- **react-native-gesture-handler** – Gestos como swipe para excluir itens.
- **Picker** – Seleção de método de pagamento.
- **Context API (`ThemeContext`)** – Suporte a tema claro/escuro global.

## Observações

As telas priorizam **experiência do usuário**, permitindo ajustes intuitivos no carrinho e finalização de pedidos com segurança. O suporte a **tema dinâmico** garante melhor usabilidade em diferentes condições de iluminação.
