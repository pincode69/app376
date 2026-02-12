import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../_layout';
import { BackIcon } from '../components/icons/BackIcon';
import { ARTICLES } from '../data/articles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ArticleScreenRouteProp = RouteProp<RootStackParamList, 'article'>;

export default function ArticleScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ArticleScreenRouteProp>();
  const { articleId } = route.params;

  const article = ARTICLES.find((a) => a.id === articleId);

  if (!article) {
    return (
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView style={styles.safeContainer}>
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <BackIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Article not found</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <BackIcon />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.title}>{article.title}</Text>

            <View style={styles.articleMeta}>
              <Text style={styles.metaText}>
                {article.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Text>
              <Text style={styles.metaSeparator}>•</Text>
              <Text style={styles.metaText}>{article.readingTime} min read</Text>
            </View>

            {article.mainImage && (
              <Image
                source={typeof article.mainImage === 'string' ? { uri: article.mainImage } : article.mainImage}
                style={styles.mainImage}
                resizeMode="cover"
              />
            )}

            <Text style={styles.bodyText}>{article.content}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E1A',
  },
  safeContainer: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  backButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  title: {
    fontFamily: 'Cinzel',
    fontWeight: '600',
    fontSize: 24,
    color: '#ead18e',
    letterSpacing: 1.2,
    marginBottom: 12,
    lineHeight: 32,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  metaText: {
    fontFamily: 'Inter Tight',
    fontSize: 12,
    color: '#9BA4FF',
    fontWeight: '400',
  },
  metaSeparator: {
    fontFamily: 'Inter Tight',
    fontSize: 12,
    color: '#9BA4FF',
    fontWeight: '400',
  },
  mainImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: '#1A1F3C',
  },
  bodyText: {
    fontFamily: 'CormorantInfant',
    fontWeight: '400',
    fontSize: 17,
    color: '#DADDF7',
    lineHeight: 28,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    fontFamily: 'Inter Tight',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
