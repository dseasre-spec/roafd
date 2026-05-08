import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BookOpen, ClipboardList, Trophy, TrendingUp,
  ChevronLeft, Clock, AlertCircle,
} from 'lucide-react-native';
import { colors, fonts, radius, spacing } from '../theme';
import { subjects, assignments, user } from '../data';

const subjectBgColors = [
  'rgba(27,94,59,0.1)', '#EFF6FF', '#F5F3FF',
  '#FFF7ED', '#FFF1F2', '#F0FDFA',
];

function formatDueLabel(date: Date): { text: string; overdue: boolean } {
  const now  = new Date();
  const diff = Math.ceil((date.getTime() - now.getTime()) / 86400000);
  if (diff < 0)  return { text: 'متأخر',   overdue: true };
  if (diff === 0) return { text: 'اليوم',   overdue: false };
  if (diff === 1) return { text: 'غداً',    overdue: false };
  return { text: `${diff} أيام`, overdue: false };
}

export default function HomeScreen() {
  const pending   = assignments.filter(a => a.status === 'pending');
  const completed = assignments.filter(a => a.status === 'graded').length;
  const upcoming  = assignments.filter(a => a.status === 'pending').slice(0, 3);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'صباح الخير 👋';
    if (h < 18) return 'مساء الخير 👋';
    return 'مساء النور 👋';
  };

  const stats = [
    { label: 'المواد',         value: subjects.length,  bgColor: 'rgba(27,94,59,0.1)', iconColor: colors.primary,      Icon: BookOpen },
    { label: 'واجبات معلقة',  value: pending.length,   bgColor: colors.orangeBg,      iconColor: colors.orange,       Icon: ClipboardList },
    { label: 'مكتملة',        value: completed,         bgColor: colors.emeraldBg,     iconColor: colors.emerald,      Icon: Trophy },
    { label: 'المعدل',         value: '87%',             bgColor: colors.blueBg,        iconColor: colors.blue,         Icon: TrendingUp },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting()}</Text>
          <Text style={styles.name}>{user.firstName}</Text>
        </View>
        <View style={styles.logoWrap}>
          <Text style={styles.logoText}>ر</Text>
        </View>
      </View>

      {/* Hero Banner */}
      <View style={styles.heroWrap}>
        <LinearGradient
          colors={['rgba(27,94,59,0.8)', '#1B5E3B']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={styles.hero}
        >
          <View style={styles.circle1} />
          <View style={styles.circle2} />
          <View style={{ zIndex: 10 }}>
            <Text style={styles.heroTag}>تعلّم · فكّر · اصنع المستقبل</Text>
            <Text style={styles.heroTitle}>مرحباً بك في روافد</Text>
            <Text style={styles.heroSub}>
              منصتك الدراسية المتكاملة لتنظيم دروسك وواجباتك
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((s, i) => (
          <View key={i} style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: s.bgColor }]}>
              <s.Icon size={18} color={s.iconColor} strokeWidth={1.5} />
            </View>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Subjects */}
      <View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>المواد الدراسية</Text>
          <TouchableOpacity style={styles.seeAll}>
            <Text style={styles.seeAllText}>عرض الكل</Text>
            <ChevronLeft size={16} color={colors.primary} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
        >
          {subjects.map((s, i) => {
            const pct = Math.round((s.completedLessons / s.totalLessons) * 100);
            return (
              <View key={s.id} style={styles.subCard}>
                <View style={[styles.subIcon, { backgroundColor: subjectBgColors[i % 6] }]}>
                  <Text style={{ fontSize: 18 }}>{s.emoji}</Text>
                </View>
                <Text style={styles.subName} numberOfLines={1}>{s.name}</Text>
                <Text style={styles.subTeacher} numberOfLines={1}>{s.teacher}</Text>
                <View style={styles.progTrack}>
                  <View style={[styles.progFill, { width: `${pct}%` as any }]} />
                </View>
                <Text style={styles.progLabel}>{pct}% مكتمل</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Upcoming Assignments */}
      <View style={{ marginTop: spacing.section }}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>الواجبات القادمة</Text>
          <TouchableOpacity style={styles.seeAll}>
            <Text style={styles.seeAllText}>عرض الكل</Text>
            <ChevronLeft size={16} color={colors.primary} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <View style={{ gap: spacing.gap, paddingHorizontal: spacing.pagePad }}>
          {upcoming.map((a) => {
            const { text, overdue } = formatDueLabel(a.dueDate);
            return (
              <View key={a.id} style={styles.aCard}>
                <View style={styles.aTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.aTitle}>{a.title}</Text>
                    <Text style={styles.aSub}>{a.subjectName}</Text>
                  </View>
                  <View style={[
                    styles.badge,
                    overdue
                      ? { backgroundColor: 'rgba(239,68,68,0.1)' }
                      : { backgroundColor: colors.muted },
                  ]}>
                    {overdue
                      ? <AlertCircle size={12} color={colors.destructive} strokeWidth={2} />
                      : <Clock size={12} color={colors.mutedForeground} strokeWidth={2} />
                    }
                    <Text style={[
                      styles.badgeText,
                      { color: overdue ? colors.destructive : colors.mutedForeground },
                    ]}>{text}</Text>
                  </View>
                </View>
                <View style={styles.aDate}>
                  <Clock size={12} color={colors.mutedForeground} strokeWidth={1.5} />
                  <Text style={styles.aDateText}>
                    {a.dueDate.toLocaleDateString('ar-SA', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content:   { paddingBottom: spacing.pageBtm },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.pagePad, paddingTop: spacing.pageTop, paddingBottom: 16,
  },
  greeting:   { fontFamily: fonts.regular, fontSize: 14, color: colors.mutedForeground },
  name:       { fontFamily: fonts.bold, fontSize: 24, color: colors.foreground, marginTop: 2 },
  logoWrap: {
    width: 48, height: 48, borderRadius: 16, overflow: 'hidden',
    borderWidth: 2, borderColor: 'rgba(27,94,59,0.2)',
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontFamily: fonts.extraBold, fontSize: 22, color: colors.primaryForeground },

  heroWrap:  { paddingHorizontal: spacing.pagePad, marginBottom: spacing.section },
  hero: {
    borderRadius: radius.xl, padding: 20, overflow: 'hidden', position: 'relative',
  },
  circle1: {
    position: 'absolute', width: 128, height: 128, borderRadius: 64,
    backgroundColor: 'rgba(255,255,255,0.05)', top: -40, left: -40,
  },
  circle2: {
    position: 'absolute', width: 96, height: 96, borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.05)', bottom: -32, right: -32,
  },
  heroTag:   { fontFamily: fonts.regular, fontSize: 14, color: 'rgba(247,244,239,0.8)' },
  heroTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.primaryForeground, marginTop: 4 },
  heroSub:   { fontFamily: fonts.regular, fontSize: 12, color: 'rgba(247,244,239,0.7)', marginTop: 8, lineHeight: 19 },

  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.gap,
    paddingHorizontal: spacing.pagePad, marginBottom: spacing.section,
  },
  statCard: {
    width: '47.5%', backgroundColor: colors.card, borderRadius: radius.lg,
    padding: spacing.card, borderWidth: 1, borderColor: 'rgba(229,223,214,0.5)',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 1, elevation: 1,
  },
  statIconWrap: { width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statValue:   { fontFamily: fonts.bold, fontSize: 24, color: colors.foreground },
  statLabel:   { fontFamily: fonts.regular, fontSize: 10, color: colors.mutedForeground, marginTop: 2 },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.pagePad, marginBottom: 12,
  },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.foreground },
  seeAll:       { flexDirection: 'row', alignItems: 'center', gap: 4 },
  seeAllText:   { fontFamily: fonts.medium, fontSize: 14, color: colors.primary },

  hScroll: { paddingHorizontal: spacing.pagePad, gap: spacing.gap },
  subCard: {
    width: 144, backgroundColor: colors.card, borderRadius: radius.lg,
    padding: spacing.card, borderWidth: 1, borderColor: 'rgba(229,223,214,0.5)',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 1, elevation: 1,
  },
  subIcon:    { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  subName:    { fontFamily: fonts.bold, fontSize: 14, color: colors.foreground },
  subTeacher: { fontFamily: fonts.regular, fontSize: 10, color: colors.mutedForeground, marginTop: 4 },
  progTrack:  { height: 6, backgroundColor: colors.muted, borderRadius: radius.full, overflow: 'hidden', marginTop: 12 },
  progFill:   { height: 6, backgroundColor: colors.primary, borderRadius: radius.full },
  progLabel:  { fontFamily: fonts.regular, fontSize: 10, color: colors.mutedForeground, marginTop: 4 },

  aCard: {
    backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.card,
    borderWidth: 1, borderColor: 'rgba(229,223,214,0.5)',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 1, elevation: 1,
  },
  aTop:      { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  aTitle:    { fontFamily: fonts.bold, fontSize: 16, color: colors.foreground },
  aSub:      { fontFamily: fonts.regular, fontSize: 12, color: colors.mutedForeground, marginTop: 4 },
  badge:     { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  badgeText: { fontFamily: fonts.medium, fontSize: 10 },
  aDate:     { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12 },
  aDateText: { fontFamily: fonts.regular, fontSize: 12, color: colors.mutedForeground },
});
