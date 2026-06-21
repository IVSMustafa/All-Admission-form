import { BookOpen, CheckCircle2, Clock, GraduationCap, Phone, UserRound } from 'lucide-react';
import type { FormData } from '../../types';
import { LeadType } from '../../types';
import { getGradeValue } from '../../constants';
import ChildRoster from './ChildRoster';
import GuidedCouponBadge from './GuidedCouponBadge';

const DRAFT_STUDENT_ID = '__draft__';

type LiveTrialSummaryProps = {
  data: FormData;
  className?: string;
};

const getProgramLabel = (leadType: FormData['leadType']) => {
  if (leadType === LeadType.FULL_TIME) return 'School Trial';
  if (leadType === LeadType.ONE_ON_ONE_SCHOOLING) return 'One-to-One Schooling';
  if (leadType === LeadType.TUITION) return 'Tuition Trial';
  if (leadType === LeadType.QURAN) return 'Quran Trial';
  return 'Not selected yet';
};

const getSchoolStudents = (data: FormData) =>
  (data.students || []).filter((student) => student.id !== DRAFT_STUDENT_ID);

const getParentCompletion = (data: FormData) => {
  const hasCountry = data.country === 'Other' ? Boolean(data.otherCountryName.trim()) : Boolean(data.country);
  const complete = [data.parentName, data.email, data.whatsapp].filter(Boolean).length + (hasCountry ? 1 : 0);

  return {
    complete,
    total: 4,
  };
};

const getChildCount = (data: FormData) => {
  if (data.leadType === LeadType.QURAN) return (data.quranStudents || []).length;
  if (data.leadType === LeadType.TUITION) return data.studentName || data.age ? 1 : 0;
  return getSchoolStudents(data).length;
};

const SummaryRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="grid grid-cols-[36px_1fr] gap-3 rounded-2xl border border-[rgba(201,225,255,0.72)] bg-white/52 px-3 py-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[rgba(29,111,206,0.09)] text-[#1d6fce]">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#6c87a7]">{label}</p>
      <div className="mt-0.5 text-sm font-black leading-relaxed text-[#0f2d57]">{value}</div>
    </div>
  </div>
);

const SchoolTrialInfo = ({ data }: { data: FormData }) => {
  const schoolStudents = getSchoolStudents(data);
  const draftGrade = data.grade ? [data.grade] : [];
  const grades = [...schoolStudents.map((student) => student.grade), ...draftGrade].filter(Boolean);
  const hasLowerGrade = grades.some((grade) => getGradeValue(grade) < 10);
  const hasUpperGrade = grades.some((grade) => getGradeValue(grade) >= 10);

  if (!grades.length) {
    return <span>Select a grade to preview the trial schedule.</span>;
  }

  return (
    <div className="space-y-2">
      {hasLowerGrade && (
        <div>
          <p>FS1 to Grade 7 fixed evening trial</p>
          <p className="text-xs font-bold text-[#5c7593]">KSA: 3:30 PM | UAE: 4:30 PM | PAK: 5:30 PM</p>
        </div>
      )}

      {hasUpperGrade && (
        <div>
          <p>Grade 8 onward curriculum-based trial</p>
          <p className="text-xs font-bold text-[#5c7593]">
            {data.curriculum ? `Curriculum: ${data.curriculum}` : 'Curriculum will appear after selection.'}
          </p>
        </div>
      )}
    </div>
  );
};

const TuitionTrialInfo = ({ data }: { data: FormData }) => (
  <div className="space-y-1">
    <p>Timing based on tutor availability.</p>
    <p className="text-xs font-bold text-[#5c7593]">
      {data.tuitionRequirements?.trim() ? 'Requirements received.' : 'Requirements are still needed.'}
    </p>
  </div>
);

const QuranTrialInfo = ({ data }: { data: FormData }) => {
  const firstStudent = (data.quranStudents || [])[0];
  const subjects = firstStudent?.subjects?.length ? firstStudent.subjects : data.quranSubjects || [];
  const days = firstStudent?.classDays?.length ? firstStudent.classDays : data.quranClassDays || [];
  const time = firstStudent?.classTime || data.quranClassTime;

  return (
    <div className="space-y-1">
      <p>{subjects.length ? subjects.join(', ') : 'Subjects not selected yet.'}</p>
      <p className="text-xs font-bold text-[#5c7593]">
        {days.length ? days.join(', ') : 'Days pending'}
        {time ? ` | ${time}` : ' | Time pending'}
      </p>
    </div>
  );
};

const TrialInfo = ({ data }: { data: FormData }) => {
  if (data.leadType === LeadType.TUITION) return <TuitionTrialInfo data={data} />;
  if (data.leadType === LeadType.QURAN) return <QuranTrialInfo data={data} />;
  if (data.leadType === LeadType.FULL_TIME || data.leadType === LeadType.ONE_ON_ONE_SCHOOLING) {
    return <SchoolTrialInfo data={data} />;
  }

  return <span>Choose a program to see trial details.</span>;
};

const SummaryContent = ({
  data,
  parentCompletion,
  childCount,
}: {
  data: FormData;
  parentCompletion: { complete: number; total: number };
  childCount: number;
}) => (
  <>
    <div className="space-y-3">
      <SummaryRow
        icon={<GraduationCap className="h-4 w-4" />}
        label="Program"
        value={getProgramLabel(data.leadType)}
      />
      <SummaryRow
        icon={<UserRound className="h-4 w-4" />}
        label="Parent details"
        value={`${parentCompletion.complete}/${parentCompletion.total} complete`}
      />
      <SummaryRow
        icon={<BookOpen className="h-4 w-4" />}
        label="Children"
        value={`${childCount} ${childCount === 1 ? 'child' : 'children'}`}
      />
      <SummaryRow
        icon={<Clock className="h-4 w-4" />}
        label="Trial info"
        value={<TrialInfo data={data} />}
      />
      <SummaryRow
        icon={<Phone className="h-4 w-4" />}
        label="WhatsApp"
        value={data.whatsapp ? 'Ready for coordinator contact' : 'Number pending'}
      />
    </div>

    <div className="mt-4 flex items-center gap-2 rounded-2xl border border-[rgba(16,185,129,0.14)] bg-emerald-50/58 px-3 py-3 text-xs font-bold text-[#047857]">
      <CheckCircle2 className="h-4 w-4 shrink-0" />
      This summary is read-only and follows the existing form data.
    </div>
  </>
);

const LiveTrialSummary = ({ data, className = '' }: LiveTrialSummaryProps) => {
  const parentCompletion = getParentCompletion(data);
  const childCount = getChildCount(data);

  return (
    <aside className={`${className}`}>
      <details className="fixed inset-x-3 bottom-3 z-50 rounded-[22px] border border-[rgba(201,225,255,0.94)] bg-[rgba(248,251,255,0.94)] shadow-[0_18px_44px_rgba(15,45,87,0.18)] backdrop-blur-xl xl:hidden">
        <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#6c87a7]">Live Summary</p>
            <p className="truncate text-sm font-black text-[#0f2d57]">
              {getProgramLabel(data.leadType)} / {childCount} {childCount === 1 ? 'child' : 'children'}
            </p>
          </div>
          <GuidedCouponBadge couponCode={data.couponCode} appliedCoupon={data.appliedCoupon} compact />
        </summary>

        <div className="max-h-[68vh] overflow-y-auto px-3 pb-3">
          <SummaryContent data={data} parentCompletion={parentCompletion} childCount={childCount} />
          <ChildRoster data={data} className="mt-3" />
        </div>
      </details>

      <div className="hidden space-y-4 xl:block">
        <section className="rounded-[28px] border border-[rgba(201,225,255,0.88)] bg-[linear-gradient(180deg,rgba(255,255,255,0.70),rgba(244,249,255,0.48))] p-4 shadow-[0_20px_48px_rgba(15,45,87,0.09)] 2xl:p-5 2xl:shadow-[0_24px_54px_rgba(15,45,87,0.10)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#6c87a7]">Live Summary</p>
            <h2 className="mt-1 text-lg font-black text-[#0f2d57]">Trial plan</h2>
          </div>
          <GuidedCouponBadge couponCode={data.couponCode} appliedCoupon={data.appliedCoupon} compact />
        </div>

        <SummaryContent data={data} parentCompletion={parentCompletion} childCount={childCount} />
        </section>

        <ChildRoster data={data} />
      </div>
    </aside>
  );
};

export default LiveTrialSummary;
