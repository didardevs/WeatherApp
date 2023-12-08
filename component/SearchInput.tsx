import React from 'react';
import {View, TouchableOpacity, TextInput, StyleSheet} from 'react-native';

import {MagnifyingGlassIcon} from 'react-native-heroicons/outline';

import {theme} from '../theme/theme';

interface SearchInputProps {
  showSearch: boolean;
  onSearchChange: (value: string) => void;
  toggleSearch: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  showSearch,
  onSearchChange,
  toggleSearch,
}) => {
  return (
    <View
      style={[
        styles.InputContainerComponent,
        {backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent'},
      ]}>
      {showSearch && (
        <TextInput
          placeholder="Search City"
          onChangeText={onSearchChange}
          placeholderTextColor="lightgray"
          style={styles.TextInputContainer}
        />
      )}
      <TouchableOpacity style={styles.RoundedButton} onPress={toggleSearch}>
        <MagnifyingGlassIcon size="25" color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  InputContainerComponent: {
    height: '7%',
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 30,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  TextInputContainer: {
    flex: 1,
    height: 20,
    fontSize: 14,
    color: 'white',
    paddingLeft: 15,
  },
  RoundedButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 13,
    marginRight: 5,
    borderRadius: 30,
    backgroundColor: theme.bgWhite(0.3),
  },
});

export default SearchInput;
