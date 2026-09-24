import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { useCart } from '../context/CartContext';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { setUserName } = useCart();
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!name.trim()) {
      setError('Please enter your name or continue as a guest');
      return;
    }
    setError('');
    setUserName(name.trim());
    navigation.replace('Home');
  };

  const handleGuestContinue = () => {
    setUserName('Guest Student');
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="school" size={36} color="#FF5722" />
            </View>
            <Text style={styles.title}>Welcome to QuickBite</Text>
            <Text style={styles.subtitle}>
              Order your favorite campus meals, drinks, and snacks ahead of time.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Student Identification</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#94A3B8"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="e.g. Kasun Perera"
                  placeholderTextColor="#94A3B8"
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    if (error) setError('');
                  }}
                  style={styles.input}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Student ID / Index (Optional)</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="card-outline"
                  size={20}
                  color="#94A3B8"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="e.g. CS/2022/045"
                  placeholderTextColor="#94A3B8"
                  value={studentId}
                  onChangeText={setStudentId}
                  style={styles.input}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Continue with Name</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleGuestContinue}
              activeOpacity={0.8}
            >
              <Ionicons name="flash-outline" size={18} color="#0F172A" />
              <Text style={styles.secondaryButtonText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerNotice}>
            <Ionicons name="shield-checkmark" size={16} color="#10B981" />
            <Text style={styles.footerNoticeText}>
              Fast campus pickup • No login credentials required
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF1EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFD7CC',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: '#0F172A',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 14,
  },
  primaryButton: {
    backgroundColor: '#FF5722',
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 8,
    shadowColor: '#FF5722',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  secondaryButton: {
    backgroundColor: '#F1F5F9',
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryButtonText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
  },
  footerNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 6,
  },
  footerNoticeText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
});
