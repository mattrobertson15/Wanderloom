import { createPlace, searchPlacesByName, useWanderloomClient } from "@wanderloom/api";
import { colors } from "@wanderloom/config";
import type { PlaceRow } from "@wanderloom/db";
import { createPlaceSchema } from "@wanderloom/validation";
import * as Location from "expo-location";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export function PlacePicker({
  value,
  onChange,
  creatorId,
}: {
  value: PlaceRow | null;
  onChange: (place: PlaceRow | null) => void;
  creatorId: string;
}) {
  const client = useWanderloomClient();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceRow[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch() {
    const trimmed = query.trim();
    if (!trimmed) return;
    setError(null);
    setLoading(true);
    try {
      const places = await searchPlacesByName(client, trimmed);
      setResults(places);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not search places");
    } finally {
      setLoading(false);
    }
  }

  function selectPlace(place: PlaceRow) {
    onChange(place);
    setQuery("");
    setResults([]);
    setSearched(false);
  }

  async function handleCreatePlace() {
    const trimmed = query.trim();
    if (!trimmed) return;
    setError(null);
    setCreating(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setError("Location access is required to create a new place.");
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      const parsed = createPlaceSchema.safeParse({
        name: trimmed,
        location: { lat: position.coords.latitude, lng: position.coords.longitude },
      });
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Invalid place details");
        return;
      }
      const place = await createPlace(client, creatorId, parsed.data);
      selectPlace(place);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create place");
    } finally {
      setCreating(false);
    }
  }

  if (value) {
    return (
      <View style={styles.chip}>
        <Text style={styles.chipLabel}>📍 {value.name}</Text>
        <Pressable onPress={() => onChange(null)}>
          <Text style={styles.changeLabel}>Change</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Search for a place"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <Pressable style={styles.searchButton} onPress={handleSearch} disabled={loading}>
          {loading ? <ActivityIndicator color="white" size="small" /> : <Text style={styles.searchButtonLabel}>Search</Text>}
        </Pressable>
      </View>

      {results.map((place) => (
        <Pressable key={place.id} style={styles.resultRow} onPress={() => selectPlace(place)}>
          <Text style={styles.resultName}>{place.name}</Text>
          {place.address && <Text style={styles.resultAddress}>{place.address}</Text>}
        </Pressable>
      ))}

      {searched && results.length === 0 && (
        <View style={styles.noResults}>
          <Text style={styles.noResultsLabel}>No places found.</Text>
          <Pressable style={styles.createButton} onPress={handleCreatePlace} disabled={creating}>
            {creating ? (
              <ActivityIndicator color={colors.accent.primary} size="small" />
            ) : (
              <Text style={styles.createButtonLabel}>Create &ldquo;{query.trim()}&rdquo; here</Text>
            )}
          </Pressable>
        </View>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: "row", gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.text.secondary + "4D",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text.primary,
  },
  searchButton: {
    backgroundColor: colors.accent.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonLabel: { color: "white", fontSize: 13, fontWeight: "600" },
  resultRow: {
    borderBottomWidth: 1,
    borderBottomColor: colors.text.secondary + "26",
    paddingVertical: 10,
  },
  resultName: { fontSize: 14, color: colors.text.primary },
  resultAddress: { fontSize: 12, color: colors.text.secondary, marginTop: 2 },
  noResults: { marginTop: 8 },
  noResultsLabel: { fontSize: 13, color: colors.text.secondary },
  createButton: { marginTop: 8, alignSelf: "flex-start" },
  createButtonLabel: { fontSize: 13, color: colors.accent.primary, fontWeight: "600" },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.text.secondary + "4D",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  chipLabel: { fontSize: 14, color: colors.text.primary },
  changeLabel: { fontSize: 13, color: colors.accent.primary, fontWeight: "600" },
  error: { color: "#DC2626", fontSize: 12, marginTop: 8 },
});
