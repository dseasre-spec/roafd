import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { User, Mail, BookOpen, ClipboardList, Trophy, Settings, LogOut, ChevronLeft } from 'lucide-react-native';
import { colors, fonts, radius, spacing } from '../theme';
import { user, subjects, assignments } from '../data';

export default function ProfileScreen() {
  const totalAssignments    = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === 'graded').length;

  const stats = [
    { label: 'المواد',    value: subjects.length,    bg: 'rgba(27,94,59,0.1)', iconColor: colors.primary, Icon: BookOpen },
    { label: 'الواجبات', value: totalAssignments,    bg: colors.blueBg,        iconColor: colors.blue,    Icon: ClipboardList },
    { label: 'المكتملة', value: completedAssignments, bg: colors.emeraldBg,   iconColor: colors.emerald, Icon: Trophy },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>حسابي</Text>
      </View>

      {/* Identity Card */}
      <View style={styles.identityCard}>
        <View style={styles.avatar}>
          <User size={36} color={colors.primary} strokeWidth={1.5} />
        </View>
        <Text style={styles.name}>{user.fullName}</Text>
        <View style={styles.emailRow}>
          <Mail size={14} color={colors.mutedForeground} strokeWidth={1.5} />
          <Text style={styles.email}>{user.email}</Text>
        </View>
        <Text style={styles.grade}>{user.grade}</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((s, i) => (
          <View key={i} style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: s.bg }]}>
              <s.Icon size={20} color={s.iconColor} strokeWidth={1.5} />
            </View>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Menu Items */}
      <View style={{ gap: 8 }}>
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.85}>
          <View style={styles.menuIconWrap}>
            <Settings size={20} color={colors.mutedForeground} strokeWidth={1.5} />
          </View>
          <Text style={styles.menuLabel}>الإعدادات</Text>
          <ChevronLeft size={20} color={colors.mutedForeground} strokeWidth={1.5} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItemDanger}
          activeOpacity={0.85}
          onPress={() => Alert.alert('تسجيل الخروج', 'هل أنت متأكد من تسجيل الخروج؟', [
            { text: 'إلغاء', style: 'cancel' },
            { text: 'خروج', style: 'destructive' },
          ])}
        >
          <View style={styles.menuIconWrapDanger}>
            <LogOut size={20} color={colors.destructive} strokeWidth={1.5} />
          </View>
          <Text style={styles.menuLabelDanger}>تسجيل الخروج</Text>
          <ChevronLeft size={20} color="rgba(239,68,68,0.4)" strokeWidth={1.5} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.pageBtm, paddingHorizontal: spacing.pagePad },
  header: { paddingTop: spacing.pageTop, paddingBottom: 24 },
  title:  { fontFamily: fonts.bold, fontSize: 24, color: colors.foreground },

  identityCard: {
    backgroundColor: colors.card, borderRadius: radius.xl, padding: 24,
    borderWidth: 1, borderColor: 'rgba(229,223,214,0.5)', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 1, elevation: 1, marginBottom: spacing.section,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(27,94,59,0.1)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  name:     { fontFamily: fonts.bold, fontSize: 20, color: colors.foreground },
  emailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  email:    { fontFamily: fonts.regular, fontSize: 14, color: colors.mutedForeground },
  grade:    { fontFamily: fonts.medium, fontSize: 12, color: colors.mutedForeground, marginTop: 8 },

  statsGrid: { flexDirection: 'row', gap: spacing.gap, marginBottom: spacing.section },
  statCard: {
    flex: 1, backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.card,
    borderWidth: 1, borderColor: 'rgba(229,223,214,0.5)', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 1, elevation: 1,
  },
  statIconWrap: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue:    { fontFamily: fonts.bold, fontSize: 20, color: colors.foreground },
  statLabel:    { fontFamily: fonts.regular, fontSize: 10, color: colors.mutedForeground },

  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.card,
    borderWidth: 1, borderColor: 'rgba(229,223,214,0.5)',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 1, elevation: 1,
  },
  menuItemDanger: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.card,
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 1, elevation: 1,
  },
  menuIconWrap:       { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.muted, alignItems: 'center', justifyContent: 'center' },
  menuIconWrapDanger: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: 'rgba(239,68,68,0.1)', alignItems: 'center', justifyContent: 'center' },
  menuLabel:          { flex: 1, fontFamily: fonts.medium, fontSize: 16, color: colors.foreground, textAlign: 'right' },
  menuLabelDanger:    { flex: 1, fontFamily: fonts.medium, fontSize: 16, color: colors.destructive, textAlign: 'right' },
});
