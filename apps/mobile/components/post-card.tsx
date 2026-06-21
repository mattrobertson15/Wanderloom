import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "@wanderloom/config";
import { formatJournalDate } from "@wanderloom/ui";
import type { MockPost } from "@/lib/mock/posts";

export function PostCard({ post }: { post: MockPost }) {
  return (
    <View style={styles.card}>
      {post.photoUrl && <Image source={{ uri: post.photoUrl }} style={styles.image} />}
      <View style={styles.body}>
        <View style={styles.metaRow}>
          {post.placeName && (
            <View style={styles.placePill}>
              <Text style={styles.placeText}>{post.placeName}</Text>
            </View>
          )}
          {post.postDate && <Text style={styles.date}>{formatJournalDate(post.postDate)}</Text>}
        </View>
        {post.title && <Text style={styles.title}>{post.title}</Text>}
        {post.body && <Text style={styles.bodyText}>{post.body}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, overflow: "hidden", backgroundColor: colors.background.elevated, marginBottom: 16 },
  image: { width: "100%", aspectRatio: 3 / 2 },
  body: { padding: 12 },
  metaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  placePill: { backgroundColor: colors.accent.primary + "1A", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  placeText: { color: colors.accent.primary, fontSize: 11 },
  date: { color: colors.text.secondary, fontSize: 11 },
  title: { marginTop: 6, fontSize: 16, fontWeight: "600", color: colors.text.primary },
  bodyText: { marginTop: 2, fontSize: 13, color: colors.text.secondary },
});
