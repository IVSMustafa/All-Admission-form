import { BookOpen, GraduationCap, UsersRound } from 'lucide-react';
import type { FormData, QuranStudent, Student } from '../../types';
import { LeadType } from '../../types';

const DRAFT_STUDENT_ID = '__draft__';

type ChildRosterProps = {
  data: FormData;
  className?: string;
};

const getSchoolStudents = (data: FormData): Student[] =>
  (data.students || []).filter((student) => student.id !== DRAFT_STUDENT_ID);

const getRosterCount = (data: FormData): number => {
  if (data.leadType === LeadType.QURAN) {
    return (data.quranStudents || []).length;
  }

  if (data.leadType === LeadType.TUITION) {
    return data.studentName || data.age ? 1 : 0;
  }

  return getSchoolStudents(data).length;
};

const SchoolChildRow = ({ student, index }: { student: Student; index: number }) => (
  <div className="grid grid-cols-[36px_1fr] gap-3 rounded-2xl border border-[rgba(29,111,206,0.10)] bg-white/58 px-3 py-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1d6fce,#0ea5e9)] text-sm font-black text-white">
      {index + 1}
    </div>
    <div className="min-w-0">
      <p className="truncate text-sm font-black text-[#0f2d57]">{student.name || 'Student'}</p>
      <p className="mt-0.5 text-xs font-semibold text-[#5c7593]">
        Age {student.age || '-'} / {student.grade || '-'}
        {student.curriculum ? ` / ${student.curriculum}` : ''}
      </p>
    </div>
  </div>
);

const QuranChildRow = ({ student, index }: { student: QuranStudent; index: number }) => (
  <div className="grid grid-cols-[36px_1fr] gap-3 rounded-2xl border border-[rgba(16,185,129,0.14)] bg-emerald-50/60 px-3 py-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#10b981,#0ea5e9)] text-sm font-black text-white">
      {index + 1}
    </div>
    <div className="min-w-0">
      <p className="truncate text-sm font-black text-[#0f2d57]">{student.name || 'Quran student'}</p>
      <p className="mt-0.5 text-xs font-semibold text-[#5c7593]">
        Age {student.age || '-'}
        {student.subjects?.length ? ` / ${student.subjects.join(', ')}` : ''}
      </p>
    </div>
  </div>
);

const ChildRoster = ({ data, className = '' }: ChildRosterProps) => {
  const schoolStudents = getSchoolStudents(data);
  const quranStudents = data.quranStudents || [];
  const count = getRosterCount(data);

  return (
    <section className={`rounded-[24px] border border-[rgba(201,225,255,0.86)] bg-white/48 p-4 shadow-[0_16px_34px_rgba(15,45,87,0.06)] ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1d6fce,#0ea5e9)] text-white shadow-[0_12px_24px_rgba(29,111,206,0.18)]">
            <UsersRound className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#0f2d57]">Children</h3>
            <p className="text-xs font-semibold text-[#6c87a7]">{count} added so far</p>
          </div>
        </div>
        <span className="rounded-full bg-[rgba(29,111,206,0.08)] px-3 py-1 text-xs font-black text-[#1d6fce]">
          {count}
        </span>
      </div>

      <div className="space-y-2.5">
        {data.leadType === LeadType.QURAN &&
          quranStudents.map((student, index) => (
            <QuranChildRow key={student.id} student={student} index={index} />
          ))}

        {(data.leadType === LeadType.FULL_TIME || data.leadType === LeadType.ONE_ON_ONE_SCHOOLING) &&
          schoolStudents.map((student, index) => (
            <SchoolChildRow key={student.id} student={student} index={index} />
          ))}

        {data.leadType === LeadType.TUITION && (data.studentName || data.age) && (
          <div className="grid grid-cols-[36px_1fr] gap-3 rounded-2xl border border-[rgba(139,92,246,0.14)] bg-purple-50/60 px-3 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8b5cf6,#1d6fce)] text-sm font-black text-white">
              1
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-[#0f2d57]">{data.studentName || 'Tuition student'}</p>
              <p className="mt-0.5 text-xs font-semibold text-[#5c7593]">Age {data.age || '-'}</p>
            </div>
          </div>
        )}

        {count === 0 && (
          <div className="rounded-2xl border border-dashed border-[rgba(29,111,206,0.18)] bg-white/42 px-4 py-4 text-sm font-semibold text-[#6c87a7]">
            Add the first child to personalize the trial plan.
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#6c87a7]">
        {data.leadType === LeadType.QURAN ? <BookOpen className="h-3.5 w-3.5" /> : <GraduationCap className="h-3.5 w-3.5" />}
        Add Another Child remains handled by the existing form controls.
      </div>
    </section>
  );
};

export default ChildRoster;
