/* ================================================================
   scoring.js — 评分算法（纯函数）
   统计10题A/B/C/D选项数量，决策树匹配8种甜点人格
   ================================================================ */

/**
 * 根据10道题的答案数组计算对应的甜点人格
 * @param {string[]} answers - 长度10的数组，每项 'A'|'B'|'C'|'D'
 * @returns {number} 人格ID (1-8)
 */
function calculateResult(answers) {
  // 1. 统计 A/B/C/D 各出现次数
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  for (const ans of answers) {
    if (counts.hasOwnProperty(ans)) {
      counts[ans]++;
    }
  }

  // 2. 按频次降序排列
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1]);

  const maxCount = sorted[0][1];
  const secondCount = sorted[1] ? sorted[1][1] : 0;
  const gap = maxCount - secondCount;

  // 收集所有并列第一的选项（字母序排列以保证确定性）
  const topKeys = sorted
    .filter(([, count]) => count === maxCount)
    .map(([key]) => key)
    .sort();

  // 3. 决策树

  // 情况1：单一选项明显领先 (gap >= 2) 或 只有一个最大值
  if (topKeys.length === 1) {
    const dominant = topKeys[0];
    if (dominant === 'A') return 2;  // 草莓奶油蛋糕
    if (dominant === 'B') return 3;  // 焦糖烤布蕾
    if (dominant === 'C') return 5;  // 甜甜圈
    if (dominant === 'D') return 6;  // 芝士乳酪蛋糕
  }

  // 情况2：两个选项并列最高
  if (topKeys.length === 2) {
    const pair = topKeys.join(''); // 字母序已排序

    switch (pair) {
      case 'AD': return 1;  // 泡芙
      case 'BD': return 4;  // 巧克力熔岩蛋糕
      case 'BC': return 7;  // 柠檬挞
      case 'AB': return 8;  // 原味吐司
      case 'AC': return 2;  // A+C → A主导优先 → 草莓奶油蛋糕
      case 'CD': return 5;  // C+D → C主导优先 → 甜甜圈
      default:  return 1;   // 兜底：泡芙
    }
  }

  // 情况3：三个或以上选项并列 → 兜底为泡芙
  return 1;
}

/**
 * 自测函数：验证评分算法覆盖所有边界情况
 * 在浏览器控制台调用 scoringSelfTest() 即可运行
 */
function scoringSelfTest() {
  const testCases = [
    // [分布描述, 答案数组, 预期结果ID, 预期名称]
    { desc: '全A',          answers: ['A','A','A','A','A','A','A','A','A','A'], expected: 2 },
    { desc: '全B',          answers: ['B','B','B','B','B','B','B','B','B','B'], expected: 3 },
    { desc: '全C',          answers: ['C','C','C','C','C','C','C','C','C','C'], expected: 5 },
    { desc: '全D',          answers: ['D','D','D','D','D','D','D','D','D','D'], expected: 6 },
    { desc: 'A主导(4,2,2,2)', answers: ['A','A','A','A','B','B','C','C','D','D'], expected: 2 },
    { desc: 'B主导(2,5,2,1)', answers: ['A','A','B','B','B','B','B','C','C','D'], expected: 3 },
    { desc: 'C主导(2,2,5,1)', answers: ['A','A','B','B','C','C','C','C','C','D'], expected: 5 },
    { desc: 'D主导(1,2,2,5)', answers: ['A','B','B','C','C','D','D','D','D','D'], expected: 6 },
    { desc: 'AB混合(4,3,2,1)', answers: ['A','A','A','A','B','B','B','C','C','D'], expected: 8 },
    { desc: 'AD混合(4,2,2,2)', answers: ['A','A','A','A','B','B','C','C','D','D'], expected: 2 }, // A主导gap=2
    { desc: 'AD混合(3,2,2,3)', answers: ['A','A','A','B','B','C','C','D','D','D'], expected: 1 },
    { desc: 'BD混合(2,3,2,3)', answers: ['A','A','B','B','B','C','C','D','D','D'], expected: 4 },
    { desc: 'BC混合(2,3,3,2)', answers: ['A','A','B','B','B','C','C','C','D','D'], expected: 7 },
    { desc: 'AB混合(3,3,2,2)', answers: ['A','A','A','B','B','B','C','C','D','D'], expected: 8 },
    { desc: '三路平票(3,3,3,1)', answers: ['A','A','A','B','B','B','C','C','C','D'], expected: 1 },
    { desc: '均匀分布(3,3,2,2)', answers: ['A','A','A','B','B','B','C','C','D','D'], expected: 8 },
    { desc: 'AC混合(4,1,4,1)', answers: ['A','A','A','A','B','C','C','C','C','D'], expected: 2 },
    { desc: 'CD混合(1,2,4,3)', answers: ['A','B','B','C','C','C','C','D','D','D'], expected: 5 },
  ];

  let passed = 0;
  let failed = 0;

  console.log('🧪 评分算法自测开始...\n');

  for (const tc of testCases) {
    const result = calculateResult(tc.answers);
    const status = result === tc.expected ? '✅' : '❌';
    if (result === tc.expected) {
      passed++;
    } else {
      failed++;
      console.log(
        `${status} ${tc.desc}: 预期=${tc.expected}(${RESULTS[tc.expected]?.name || '?'}), 实际=${result}(${RESULTS[result]?.name || '?'})`
      );
    }
  }

  console.log(`\n${passed} passed, ${failed} failed / ${testCases.length} total`);
  if (failed === 0) {
    console.log('🎉 所有测试用例通过！');
  }

  return { passed, failed, total: testCases.length };
}
