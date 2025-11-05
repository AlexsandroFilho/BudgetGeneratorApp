import { StyleSheet, ScrollView, View } from 'react-native';
import { ThemedText, ThemedView } from './components';
import { useThemeColor } from './hooks';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const mainFeatures = [
  {
    icon: 'bulb-outline',
    title: 'Análise Inteligente',
    description: 'Nossa IA analisa seus dados e sugere os melhores preços baseados no mercado.',
  },
  {
    icon: 'person-add-outline',
    title: 'Sugestões Personalizadas',
    description: 'Receba recomendações específicas para seu nicho de mercado.',
  },
  {
    icon: 'time-outline',
    title: 'Economia de Tempo',
    description: 'Gere orçamentos em minutos, não em horas. Foque no que realmente importa.',
  },
];

const secondaryFeatures = [
    {
        icon: 'speedometer-outline',
        title: 'Início Rápido',
        description: 'Configure seu perfil e comece a gerar orçamentos em minutos.'
    },
    {
        icon: 'checkmark-circle-outline',
        title: 'Resultados Confiáveis',
        description: 'Algoritmos precisos e atualizados com as tendências do mercado.'
    },
    {
        icon: 'bar-chart-outline',
        title: 'Análise Detalhada',
        description: 'Visualize dados e métricas importantes para tomar melhores decisões.'
    },
    {
        icon: 'options-outline',
        title: 'Personalização Inteligente',
        description: 'Adapte os orçamentos ao seu estilo e necessidades específicas.'
    },
    {
        icon: 'person-add-outline',
        title: 'Ideal para Iniciantes',
        description: 'Interface intuitiva e suporte para quem está começando.'
    },
    {
        icon: 'document-text-outline',
        title: 'Orçamentos Profissionais',
        description: 'Documentos com aparência profissional e prontos para apresentar.'
    }
];


export default function App() {
  const primaryColor = useThemeColor({}, 'primary');
  const boxBackgroundColor = useThemeColor({}, 'boxBackground');
  const iconColor = useThemeColor({}, 'icon');

  const FeatureBox = ({ feature }: { feature: typeof mainFeatures[0] }) => (
    <View style={[styles.boxInfo, { backgroundColor: boxBackgroundColor }]}>
      <Ionicons name={feature.icon as any} size={32} color={primaryColor} style={styles.icon} />
      <ThemedText type="subtitle" style={{ color: primaryColor }}>{feature.title}</ThemedText>
      <ThemedText style={styles.boxText}>{feature.description}</ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerSection}>
          <ThemedText type="title" style={[styles.title, { color: primaryColor }]}>
            Gere Orçamentos Profissionais com IA
          </ThemedText>
          <ThemedText style={styles.lead}>
            Transforme suas ideias em orçamentos detalhados e precisos com a ajuda da nossa inteligência artificial. Perfeito para profissionais iniciantes e experientes.
          </ThemedText>
        </View>

        <View style={styles.featuresSection}>
          {mainFeatures.map((feature, index) => (
            <FeatureBox key={`main-${index}`} feature={feature} />
          ))}
        </View>

        <View style={[styles.separator, { backgroundColor: iconColor }]} />

        <View style={styles.secondarySection}>
            <ThemedText type="title" style={[styles.sectionTitle, { color: primaryColor }]}>
                Por que escolher nossa plataforma?
            </ThemedText>
            {secondaryFeatures.map((feature, index) => (
                <FeatureBox key={`secondary-${index}`} feature={feature} />
            ))}
        </View>

      </ScrollView>
      <StatusBar style="auto" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    textAlign: 'center',
    marginBottom: 16,
  },
  lead: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
  },
  featuresSection: {},
  boxInfo: {
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginBottom: 12,
  },
  boxText: {
    marginTop: 8,
  },
  separator: {
      height: 1,
      width: '90%',
      alignSelf: 'center',
      marginVertical: 30,
      opacity: 0.2,
  },
  secondarySection: {},
  sectionTitle: {
      textAlign: 'center',
      marginBottom: 24,
      fontSize: 28,
  }
});