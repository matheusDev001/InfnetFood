// __tests__/HomeScreen.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exibe a lista de categorias corretamente', () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    expect(getByText('Refeições')).toBeTruthy();
    expect(getByText('Lanches')).toBeTruthy();
    expect(getByText('Bebidas')).toBeTruthy();
    expect(getByText('Sobremesas')).toBeTruthy();
  });

  it('navega para a tela de produtos ao tocar em uma categoria', () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    const categoria = getByText('Categorias');
    fireEvent.press(categoria);

    expect(mockNavigate).toHaveBeenCalledWith('Products', { category: 'Eletrônicos' });
  });
});
