/**
 * Phase 1 Validation Test
 * Tests the API client against validation criteria
 */

import { api, APIClientError, getErrorMessage } from '@/services/api';

export async function validatePhase1() {
  console.log('🔍 Validating Phase 1: API Client Foundation...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: [] as Array<{ name: string; passed: boolean; details?: string }>
  };

  // Test 1: API Client Services Instantiated
  try {
    const servicesExist = !!(
      api.integrations && 
      api.organizations && 
      api.analytics && 
      api.agents
    );
    
    if (servicesExist) {
      results.passed++;
      results.tests.push({ name: 'API Client Services Instantiated', passed: true });
      console.log('✅ API Client Services Instantiated');
    } else {
      results.failed++;
      results.tests.push({ 
        name: 'API Client Services Instantiated', 
        passed: false, 
        details: 'One or more services missing' 
      });
      console.log('❌ API Client Services Instantiated - Missing services');
    }
  } catch (error) {
    results.failed++;
    results.tests.push({ 
      name: 'API Client Services Instantiated', 
      passed: false, 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
    console.log('❌ API Client Services Instantiated - Error:', error);
  }

  // Test 2: Type-safe Methods Available  
  try {
    const methodsExist = !!(
      typeof api.integrations.getIntegrations === 'function' &&
      typeof api.integrations.createCredential === 'function' &&
      typeof api.organizations.getOrganizations === 'function' &&
      typeof api.analytics.getUsageAnalytics === 'function' &&
      typeof api.agents.getVoiceAgents === 'function'
    );
    
    if (methodsExist) {
      results.passed++;
      results.tests.push({ name: 'Type-safe Methods Available', passed: true });
      console.log('✅ Type-safe Methods Available');
    } else {
      results.failed++;
      results.tests.push({ 
        name: 'Type-safe Methods Available', 
        passed: false, 
        details: 'Required methods missing' 
      });
      console.log('❌ Type-safe Methods Available - Missing methods');
    }
  } catch (error) {
    results.failed++;
    results.tests.push({ 
      name: 'Type-safe Methods Available', 
      passed: false, 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
    console.log('❌ Type-safe Methods Available - Error:', error);
  }

  // Test 3: Error Handling Consistency
  try {
    const testError = new APIClientError('Test error', 400, 'TEST_CODE');
    const hasCorrectProperties = !!(
      testError.statusCode === 400 && 
      testError.code === 'TEST_CODE' &&
      testError.isClientError &&
      typeof getErrorMessage === 'function'
    );
    
    if (hasCorrectProperties) {
      results.passed++;
      results.tests.push({ name: 'Error Handling Consistency', passed: true });
      console.log('✅ Error Handling Consistency');
    } else {
      results.failed++;
      results.tests.push({ 
        name: 'Error Handling Consistency', 
        passed: false, 
        details: 'Error properties or helpers missing' 
      });
      console.log('❌ Error Handling Consistency - Properties missing');
    }
  } catch (error) {
    results.failed++;
    results.tests.push({ 
      name: 'Error Handling Consistency', 
      passed: false, 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
    console.log('❌ Error Handling Consistency - Error:', error);
  }

  // Test 4: Backend Connectivity Check
  try {
    const response = await fetch('http://127.0.0.1:8000/health');
    const connected = response.ok;
    
    if (connected) {
      results.passed++;
      results.tests.push({ name: 'Backend Connectivity (http://127.0.0.1:8000)', passed: true });
      console.log('✅ Backend Connectivity (http://127.0.0.1:8000)');
    } else {
      results.failed++;
      results.tests.push({ 
        name: 'Backend Connectivity (http://127.0.0.1:8000)', 
        passed: false, 
        details: `HTTP ${response.status}: ${response.statusText}` 
      });
      console.log('❌ Backend Connectivity - Server responded with error');
    }
  } catch (error) {
    results.failed++;
    results.tests.push({ 
      name: 'Backend Connectivity (http://127.0.0.1:8000)', 
      passed: false, 
      details: 'Cannot connect to backend server' 
    });
    console.log('❌ Backend Connectivity - Cannot connect to backend server');
  }

  // Test 5: Endpoint Mapping Coverage
  try {
    const expectedEndpoints = [
      'integrations.getIntegrations',
      'integrations.createCredential', 
      'integrations.testCredential',
      'integrations.installIntegration',
      'integrations.dispatch',
      'organizations.getOrganizations',
      'organizations.switchTenant',
      'analytics.getUsageAnalytics',
      'analytics.getCostAnalysis',
      'agents.getVoiceAgents',
      'agents.createVoiceAgent'
    ];

    let mappedCount = 0;
    const missing = [];

    for (const endpoint of expectedEndpoints) {
      const [service, method] = endpoint.split('.');
      try {
        const serviceObj = (api as any)[service];
        if (serviceObj && typeof serviceObj[method] === 'function') {
          mappedCount++;
        } else {
          missing.push(endpoint);
        }
      } catch {
        missing.push(endpoint);
      }
    }

    const coveragePercentage = (mappedCount / expectedEndpoints.length) * 100;
    const passed = coveragePercentage >= 90; // 90% coverage required

    if (passed) {
      results.passed++;
      results.tests.push({ 
        name: 'Endpoint Mapping Coverage', 
        passed: true, 
        details: `${mappedCount}/${expectedEndpoints.length} endpoints mapped (${coveragePercentage.toFixed(1)}%)` 
      });
      console.log(`✅ Endpoint Mapping Coverage - ${coveragePercentage.toFixed(1)}%`);
    } else {
      results.failed++;
      results.tests.push({ 
        name: 'Endpoint Mapping Coverage', 
        passed: false, 
        details: `Only ${mappedCount}/${expectedEndpoints.length} endpoints mapped (${coveragePercentage.toFixed(1)}%). Missing: ${missing.join(', ')}` 
      });
      console.log(`❌ Endpoint Mapping Coverage - Only ${coveragePercentage.toFixed(1)}%`);
    }
  } catch (error) {
    results.failed++;
    results.tests.push({ 
      name: 'Endpoint Mapping Coverage', 
      passed: false, 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
    console.log('❌ Endpoint Mapping Coverage - Error:', error);
  }

  // Summary
  console.log('\n📊 Phase 1 Validation Summary:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

  const allPassed = results.failed === 0;
  console.log(`\n🎯 Phase 1 Status: ${allPassed ? 'COMPLETE ✅' : 'NEEDS WORK ❌'}`);

  return {
    success: allPassed,
    results,
    summary: {
      passed: results.passed,
      failed: results.failed,
      successRate: (results.passed / (results.passed + results.failed)) * 100
    }
  };
}

// Export for use in components
export default validatePhase1;