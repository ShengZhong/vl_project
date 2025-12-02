/**
 * VL广告指导建议 - 概览页面
 * 功能点ID: VL-ADGD-001
 */

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Button, Spin, message, Progress } from 'antd';
import {
  TrophyOutlined,
  BulbOutlined,
  WarningOutlined,
  RightOutlined,
  FacebookOutlined,
  GoogleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import { getOverviewData } from '@/services/adguidance';
import type { OverviewData, PlatformStat, OptimizationCase } from '@/types/adguidance';
import './index.less';

const AdGuidanceOverview: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [currentCaseIndex, setCurrentCaseIndex] = useState<number>(0);

  // 加载概览数据
  const loadOverviewData = async () => {
    setLoading(true);
    try {
      const response = await getOverviewData();
      if (response.code === 200) {
        setOverviewData(response.data);
      } else {
        message.error(response.message || '加载数据失败');
        console.error('加载概览数据失败:', response);
      }
    } catch (error) {
      console.error('加载概览数据异常:', error);
      message.error('加载数据失败: ' + (error instanceof Error ? error.message : '请稍后重试'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverviewData();
  }, []);

  // 自动轮播优化案例
  useEffect(() => {
    if (overviewData && overviewData.featuredCases.length > 1) {
      const timer = setInterval(() => {
        setCurrentCaseIndex((prev) => (prev + 1) % overviewData.featuredCases.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [overviewData]);

  // 获取平台图标
  const getPlatformIcon = (platformCode: string) => {
    const iconStyle = { fontSize: 40 };
    switch (platformCode) {
      case 'META':
        return <FacebookOutlined style={{ ...iconStyle, color: '#1877F2' }} />;
      case 'GOOGLE':
        return <GoogleOutlined style={{ ...iconStyle, color: '#4285F4' }} />;
      case 'TIKTOK':
        return (
          <svg 
            viewBox="0 0 24 24" 
            width="40" 
            height="40"
            fill="none"
            style={{ display: 'block' }}
          >
            <path 
              d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
              fill="#000000"
            />
          </svg>
        );
      default:
        return <PlayCircleOutlined style={iconStyle} />;
    }
  };

  // 跳转到账户管理页
  const goToAccountManagement = (platformCode?: string) => {
    const url = platformCode
      ? `/adguidance/accounts?platform=${platformCode}`
      : '/adguidance/accounts';
    history.push(url);
  };

  // 跳转到优化建议页
  const goToRecommendations = (scoreRange?: string) => {
    const url = scoreRange
      ? `/adguidance/recommendations?scoreRange=${scoreRange}`
      : '/adguidance/recommendations';
    history.push(url);
  };

  // 渲染优化案例卡片
  const renderFeaturedCase = (caseData: OptimizationCase) => {
    return (
      <Card className="featured-case-card" bordered={false}>
        <Row gutter={24} align="middle">
          <Col span={16}>
            <div className="case-header">
              <div className="case-badge">成功案例</div>
              <div className="case-customer">
                <div className="customer-name">{caseData.customerName}</div>
                <div className="customer-industry">{caseData.industry}</div>
              </div>
            </div>
            <div className="case-description">{caseData.description}</div>
          </Col>
          <Col span={8}>
            <Row gutter={16} className="case-metrics">
              <Col span={24}>
                <div className="metric-item">
                  <div className="metric-label">转化分数</div>
                  <div className="metric-value success">{`${caseData.scoreBefore} → ${caseData.scoreAfter}`}</div>
                </div>
              </Col>
              <Col span={24}>
                <div className="metric-item">
                  <div className="metric-label">3倍化增长</div>
                  <div className="metric-value primary">{caseData.conversionImprovement}</div>
                </div>
              </Col>
              <Col span={24}>
                <div className="metric-item">
                  <div className="metric-label">ROAS</div>
                  <div className="metric-value warning">{caseData.roasValue}</div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="case-action">
          <Button
            type="primary"
            size="large"
            icon={<BulbOutlined />}
            onClick={() => goToRecommendations()}
          >
            立即优化
          </Button>
        </div>
      </Card>
    );
  };

  // 渲染平台统计卡片
  const renderPlatformCard = (platformStat: PlatformStat) => {
    const { platform, accountCount, recommendationCount, totalBalance } = platformStat;
    
    return (
      <Card
        key={platform.platformCode}
        className="platform-card"
        hoverable
        onClick={() => goToAccountManagement(platform.platformCode)}
      >
        <div className="platform-header">
          <div className="platform-icon">
            {getPlatformIcon(platform.platformCode)}
          </div>
          <div className="platform-info">
            <div className="platform-name">{platform.platformName}</div>
            <div className="platform-code">{platform.platformCode}</div>
          </div>
        </div>
        <div className="platform-stats">
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <div className="stat-item">
                <div className="stat-label">账户数</div>
                <div className="stat-value">{accountCount} <span className="stat-unit">个</span></div>
              </div>
            </Col>
            <Col span={8}>
              <div className="stat-item">
                <div className="stat-label">优化建议</div>
                <div className="stat-value" style={{ color: recommendationCount > 0 ? '#1890ff' : undefined }}>
                  {recommendationCount} <span className="stat-unit">条</span>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="stat-item">
                <div className="stat-label">总余额</div>
                <div className="stat-value">
                  <span className="stat-currency">$</span>
                  {totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="platform-actions">
          {accountCount > 0 ? (
            <Button type="link" icon={<RightOutlined />} iconPosition="end">
              查看账户详情
            </Button>
          ) : (
            <Button type="link" icon={<RightOutlined />} iconPosition="end">
              添加账户
            </Button>
          )}
        </div>
      </Card>
    );
  };

  // 渲染机会分数分布卡片
  const renderScoreDistribution = () => {
    if (!overviewData) return null;
    
    const { excellent, good, poor } = overviewData.scoreDistribution;
    const total = excellent + good + poor;

    return (
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card
            className="score-card excellent"
            hoverable
            onClick={() => goToRecommendations('80-100')}
          >
            <TrophyOutlined className="score-icon" />
            <Statistic
              title="优秀"
              value={excellent}
              suffix="个账户"
              valueStyle={{ color: '#52c41a' }}
            />
            <div className="score-desc">机会分数 ≥ 80</div>
            {total > 0 && (
              <Progress
                percent={Math.round((excellent / total) * 100)}
                strokeColor="#52c41a"
                showInfo={false}
              />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            className="score-card good"
            hoverable
            onClick={() => goToRecommendations('40-80')}
          >
            <BulbOutlined className="score-icon" />
            <Statistic
              title="待改进"
              value={good}
              suffix="个账户"
              valueStyle={{ color: '#faad14' }}
            />
            <div className="score-desc">机会分数 40-79</div>
            {total > 0 && (
              <Progress
                percent={Math.round((good / total) * 100)}
                strokeColor="#faad14"
                showInfo={false}
              />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            className="score-card poor"
            hoverable
            onClick={() => goToRecommendations('0-40')}
          >
            <WarningOutlined className="score-icon" />
            <Statistic
              title="需关注"
              value={poor}
              suffix="个账户"
              valueStyle={{ color: '#f5222d' }}
            />
            <div className="score-desc">机会分数 &lt; 40</div>
            {total > 0 && (
              <Progress
                percent={Math.round((poor / total) * 100)}
                strokeColor="#f5222d"
                showInfo={false}
              />
            )}
          </Card>
        </Col>
      </Row>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!overviewData) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 100 }}>
        <p>暂无数据</p>
        <Button type="primary" onClick={loadOverviewData}>
          刷新
        </Button>
      </div>
    );
  }

  return (
    <div className="adguidance-overview">
      {/* 顶部优化案例横幅 */}
      {overviewData.featuredCases.length > 0 && (
        <div className="featured-case-section">
          {renderFeaturedCase(overviewData.featuredCases[currentCaseIndex])}
          {overviewData.featuredCases.length > 1 && (
            <div className="case-indicators">
              {overviewData.featuredCases.map((_, index) => (
                <div
                  key={index}
                  className={`indicator ${index === currentCaseIndex ? 'active' : ''}`}
                  onClick={() => setCurrentCaseIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 平台统计卡片 */}
      <div className="platform-section">
        <h2 className="section-title">广告平台</h2>
        <Row gutter={24}>
          {overviewData.platforms.map((platformStat) => (
            <Col key={platformStat.platform.platformCode} span={8}>
              {renderPlatformCard(platformStat)}
            </Col>
          ))}
        </Row>
      </div>

      {/* 机会分数分布 */}
      <div className="score-section">
        <h2 className="section-title">账户机会分数分布</h2>
        {renderScoreDistribution()}
      </div>
    </div>
  );
};

export default AdGuidanceOverview;

