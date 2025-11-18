import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../navigation/AppStack';

type NavigationProps = StackNavigationProp<AppStackParamList>;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
        padding: 5,
        borderRadius: 20,
    },
    image: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#FFFFFF',
    },
    name: {
        color: '#FFFFFF',
        marginLeft: 8,
        fontWeight: '600',
        fontSize: 12,
    },
});

export const HeaderProfileButton = () => {
    const { user } = useAuth();
    const navigation = useNavigation<NavigationProps>();
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

    useEffect(() => {
        const loadSavedPhoto = async () => {
            if (user?.id) {
                try {
                    const photoPath = await AsyncStorage.getItem(`userPhoto_${user.id}`);
                    if (photoPath) {
                        setProfilePhoto(photoPath);
                    }
                } catch (error) {
                    console.error('Erro ao carregar foto para o header:', error);
                }
            }
        };
        loadSavedPhoto();
    }, [user?.id]);

    if (!user) {
        return null;
    }

    return (
        <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('Home')}>
            {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={styles.image} />
            ) : (
                <Ionicons name="person-circle" size={32} color="#FFFFFF" />
            )}
            <Text style={styles.name}>{user.name.split(' ')[0]}</Text>
        </TouchableOpacity>
    );
};
