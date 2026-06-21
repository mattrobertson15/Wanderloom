import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "@wanderloom/config";
import { OAuthButtons } from "@/components/oauth-buttons";
import { getMobileSupabaseClient } from "@/lib/supabase/client";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    setLoading(true);
    setError(null);
    const supabase = getMobileSupabaseClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) setError(signInError.message);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Pressable style={styles.button} onPress={handleSignIn} disabled={loading}>
        <Text style={styles.buttonLabel}>{loading ? "Signing in…" : "Sign in"}</Text>
      </Pressable>
      <OAuthButtons />
      <Link href="/sign-up" style={styles.link}>
        New to Wanderloom? Create an account
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: colors.background.base },
  title: { fontSize: 24, marginBottom: 24, color: colors.text.primary },
  input: {
    borderWidth: 1,
    borderColor: colors.text.secondary + "4D",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  error: { color: "#DC2626", marginBottom: 8 },
  button: { backgroundColor: colors.accent.primary, borderRadius: 999, paddingVertical: 12, alignItems: "center" },
  buttonLabel: { color: "white", fontSize: 14, fontWeight: "600" },
  link: { marginTop: 24, textAlign: "center", color: colors.accent.primary },
});
