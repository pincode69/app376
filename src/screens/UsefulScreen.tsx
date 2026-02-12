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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../_layout';
import HeaderComponent from '../components/HeaderComponent';
import { BackIcon } from '../components/icons/BackIcon';
import { ARTICLES, Article } from '../data/articles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function UsefulScreen() {
  const navigation = useNavigation<NavigationProp>();

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

        <HeaderComponent title="Useful" />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.articlesList}>
            {ARTICLES.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onPress={() => navigation.navigate('article', { articleId: article.id })}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function ArticleCard({
  article,
  onPress,
}: {
  article: Article;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.articleCard} onPress={onPress} activeOpacity={0.85}>
      {article.thumbnailImage && (
        <Image
          source={typeof article.thumbnailImage === 'string' ? { uri: article.thumbnailImage } : article.thumbnailImage}
          style={styles.thumbnailImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle}>{article.title}</Text>
        <Text style={styles.articleDescription}>{article.shortDescription}</Text>
        <View style={styles.articleMeta}>
          <Text style={styles.metaText}>
            {article.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Text>
          <Text style={styles.metaSeparator}>•</Text>
          <Text style={styles.metaText}>{article.readingTime} min read</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E1A',
  },
  safeContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
  },
  backButton: {
    padding: 4,
  },
  articlesList: {
    gap: 16,
    paddingBottom: 20,
  },
  articleCard: {
    backgroundColor: '#11152A',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2E3570',
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#1A1F3C',
  },
  articleContent: {
    gap: 8,
  },
  articleTitle: {
    fontFamily: 'Cinzel',
    fontWeight: '600',
    fontSize: 18,
    color: '#ead18e',
    letterSpacing: 1.2,
  },
  articleDescription: {
    fontFamily: 'CormorantInfant',
    fontWeight: '400',
    fontSize: 15,
    color: '#DADDF7',
    lineHeight: 22,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
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
});
